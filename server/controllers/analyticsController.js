const { Complaint, Department } = require('../models');
const { Op } = require('sequelize');

exports.getComplaintLocations = async (req, res) => {
  try {
    const { category, status, department, startDate, endDate } = req.query;
    
    let where = {};
    
    if (category) where.category = category;
    if (status) where.status = status;
    if (department) where.department_id = department;
    
    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Only return complaints with coordinates
    where.latitude = { [Op.ne]: null };
    where.longitude = { [Op.ne]: null };

    const complaints = await Complaint.findAll({
      where,
      attributes: ['id', 'title', 'category', 'latitude', 'longitude', 'status', 'department_id', 'created_at'],
      include: [
        { model: Department, attributes: ['name'] }
      ]
    });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
