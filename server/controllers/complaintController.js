const { Complaint, Department, ComplaintUpdate, User } = require('../models');
const { classifyComplaint } = require('../services/aiService');

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, image_url, location, latitude, longitude } = req.body;
    const userId = req.user.id;

    // AI Fallback if not provided or confirmed by user
    let finalCategory = category;
    let finalPriority = priority || 'normal';
    let finalDeptId = null;

    const aiResult = classifyComplaint(description);
    
    if (!finalCategory) finalCategory = aiResult.category;
    if (!priority) finalPriority = aiResult.priority;

    // Find department based on either provided category or AI result
    const deptCode = aiResult.deptCode;
    if (deptCode) {
      const dept = await Department.findOne({ where: { code: deptCode } });
      if (dept) finalDeptId = dept.id;
    }

    const complaintId = `C-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const complaint = await Complaint.create({
      id: complaintId,
      title,
      description,
      category: finalCategory,
      department_id: finalDeptId,
      priority: finalPriority,
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

    const aiResult = classifyComplaint(description);
    res.json(aiResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
