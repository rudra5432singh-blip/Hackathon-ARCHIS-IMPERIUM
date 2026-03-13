const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, complaintController.createComplaint);
router.get('/popular', auth, complaintController.getPopularComplaints);
router.post('/generate-demo-complaints', auth, adminOnly, complaintController.generateDemoComplaints);
router.get('/', auth, complaintController.getAllComplaints);
router.get('/:id', auth, complaintController.getComplaintById);
router.post('/:id/vote', auth, complaintController.voteComplaint);
router.put('/:id/status', auth, adminOnly, complaintController.updateStatus);
router.patch('/:id/progress', auth, adminOnly, complaintController.updateProgress);
router.post('/analyze', auth, complaintController.analyzeComplaint);

module.exports = router;
