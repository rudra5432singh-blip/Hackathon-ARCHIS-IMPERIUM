const User = require('./User');
const Complaint = require('./Complaint');
const Department = require('./Department');
const ComplaintUpdate = require('./ComplaintUpdate');

// User <-> Complaint (Created by)
User.hasMany(Complaint, { foreignKey: 'created_by' });
Complaint.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Department <-> Complaint
Department.hasMany(Complaint, { foreignKey: 'department_id' });
Complaint.belongsTo(Department, { foreignKey: 'department_id' });

// User <-> Department (Department Admin)
Department.hasMany(User, { foreignKey: 'department_id' });
User.belongsTo(Department, { foreignKey: 'department_id' });

// Complaint <-> ComplaintUpdate
Complaint.hasMany(ComplaintUpdate, { foreignKey: 'complaint_id' });
ComplaintUpdate.belongsTo(Complaint, { foreignKey: 'complaint_id' });

// User <-> ComplaintUpdate (Updated by)
User.hasMany(ComplaintUpdate, { foreignKey: 'updated_by' });
ComplaintUpdate.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

module.exports = { User, Complaint, Department, ComplaintUpdate };
