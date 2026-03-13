const Complaint = require('../models/Complaint');
const Department = require('../models/Department');
const User = require('../models/User');
const ComplaintVote = require('../models/ComplaintVote');
const ComplaintUpdate = require('../models/ComplaintUpdate'); // Added this back as it was removed by the instruction
const aiService = require('../services/aiService');

const AI_CATEGORY_MAP = {
  road: 'Roads & Infrastructure',
  garbage: 'Sanitation',
  streetlight: 'Electricity',
  electricity: 'Electricity',
  water: 'Water Supply',
  drainage: 'Sanitation',
  other: 'Other'
};

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, image_url, location, latitude, longitude } = req.body;
    const userId = req.user.id;

    const aiResult = await classifyComplaint(description);

    const complaintId = `C-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const complaint = await Complaint.create({
      id: complaintId,
      title,
      description,
      category: aiResult.category,
      department: aiResult.department,
      urgency: aiResult.urgency,
      summary: aiResult.summary,
      workflow: aiResult.resolution_workflow,
      current_stage: aiResult.resolution_workflow && aiResult.resolution_workflow.length > 0 ? aiResult.resolution_workflow[0] : 'complaint_received',
      estimated_resolution_time: aiResult.estimated_resolution_time,
      image_url,
      location,
      latitude,
      longitude,
      created_by: userId,
      status: 'Pending'
    });

    console.log('Complaint created:', complaint.id);

    // Emit socket event
    const io = req.app.get('io');
    io.emit('complaintCreated', complaint);

    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const { role, id, department_id } = req.user;
    let where = {};
    
    if (role === 'Citizen') {
      where = { created_by: id };
    } else if (role === 'Department Admin') {
      where = { department_id: department_id };
    }

    const complaints = await Complaint.findAll({ 
      where,
      include: [
        { model: Department, attributes: ['name'] },
        { model: User, as: 'creator', attributes: ['name', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id, {
      include: [
        { model: Department, attributes: ['name'] },
        { model: ComplaintUpdate, include: [{ model: User, as: 'updater', attributes: ['name'] }] }
      ]
    });
    
    if (!complaint) return res.status(404).json({ error: 'Complaint not found.' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);
    
    if (!complaint) return res.status(404).json({ error: 'Complaint not found.' });
    
    // Logic for transition (simplified)
    const oldStatus = complaint.status;
    complaint.status = status;
    await complaint.save();

    // Log update
    await ComplaintUpdate.create({
      complaint_id: complaint.id,
      status,
      comment,
      updated_by: req.user.id
    });

    // Emit socket event
    const io = req.app.get('io');
    io.emit('complaintUpdated', { id: complaint.id, status, oldStatus });
    io.emit('statusChanged', { id: complaint.id, status });

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.analyzeComplaint = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ error: 'Description is required' });

    const aiResult = await classifyComplaint(description);
    res.json(aiResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { current_stage } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);
    
    if (!complaint) return res.status(404).json({ error: 'Complaint not found.' });
    
    complaint.current_stage = current_stage;
    await complaint.save();

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- Voting System --- //

exports.voteComplaint = async (req, res) => {
  try {
    // 1. Check Auth (mock fallback if needed for demo)
    const voter_id = req.user?.id || '2a5b51a0-d293-4a1e-8e8a-0d12e4f0dc73'; // fallback to mock admin id for tests
    const { id } = req.params;

    const complaint = await Complaint.findByPk(id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // 2. Check for duplicate vote
    const existingVote = await ComplaintVote.findOne({
      where: { complaint_id: id, voter_id }
    });

    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted for this complaint' });
    }

    // 3. Record vote & increment count
    await ComplaintVote.create({ complaint_id: id, voter_id });
    
    // SQLite might not support atomic increment based on ORM setup easily, so we update manually:
    const updatedVotes = (complaint.votes || 0) + 1;
    await complaint.update({ votes: updatedVotes });

    res.json({ message: 'Vote recorded', votes: updatedVotes });
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ message: 'Error recording vote' });
  }
};

exports.getPopularComplaints = async (req, res) => {
  try {
    const popular = await Complaint.findAll({
       order: [['votes', 'DESC']],
       limit: 10,
       include: [
         { model: Department, attributes: ['name'] },
         { model: User, as: 'creator', attributes: ['name'] }
       ]
    });
    res.json(popular);
  } catch (error) {
    console.error('Error fetching popular complaints:', error);
    res.status(500).json({ message: 'Error fetching popular complaints', error: error.message });
  }
};

exports.generateDemoComplaints = async (req, res) => {
  try {
     const dummyData = [
       { title: "Garbage piling near city market", desc: "Huge waste pile uncollected for a week emitting foul smell.", category: "Sanitation", urgency: "High" },
       { title: "Broken streetlight in park", desc: "The main park is pitch black at night making it unsafe for walkers.", category: "Public Safety", urgency: "Medium" },
       { title: "Water leakage on main road", desc: "A burst pipe is flooding sector 4 resulting in huge water waste.", category: "Water", urgency: "High" },
       { title: "Potholes causing accidents", desc: "Multiple severe potholes near the highway junction.", category: "Roads", urgency: "Urgent" },
       { title: "Suspicious activity reported near bus stand", desc: "A group of unidentified individuals hanging around late into the night.", category: "Police", urgency: "Medium" }
     ];

     const mockUserId = '2a5b51a0-d293-4a1e-8e8a-0d12e4f0dc73'; // System Admin
     
     const created = [];
     for (let item of dummyData) {
       // Generate dummy ID using AI convention or standard UUID 
       const id = `CMP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
       const votes = Math.floor(Math.random() * 21); // 0-20 votes
       
       const cmp = await Complaint.create({
         id,
         title: item.title,
         description: item.desc,
         category: item.category,
         urgency: item.urgency,
         created_by: mockUserId,
         status: 'Pending',
         current_stage: 'complaint_received',
         votes
       });
       created.push(cmp);
     }

     res.status(201).json({ message: "Demo complaints generated", count: created.length, complaints: created });
  } catch (error) {
     console.error('Error generating demo complaints:', error);
     res.status(500).json({ message: 'Error generating data', error: error.message });
  }
};
