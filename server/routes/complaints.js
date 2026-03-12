const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, complaintController.createComplaint);
router.get('/', auth, complaintController.getAllComplaints);
router.get('/:id', auth, complaintController.getComplaintById);
router.put('/:id/status', auth, adminOnly, complaintController.updateStatus);
router.post('/analyze', auth, complaintController.analyzeComplaint);

module.exports = router;
