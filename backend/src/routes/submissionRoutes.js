const express = require('express');
const { authRequired, adminRequired } = require('../middleware/authMiddleware');
const {
  submitNews,
  listPendingSubmissions,
  approveSubmission,
  rejectSubmission
} = require('../controllers/submissionController');

const router = express.Router();

router.post('/', authRequired, submitNews);
router.get('/', authRequired, adminRequired, listPendingSubmissions);
router.patch('/:id/approve', authRequired, adminRequired, approveSubmission);
router.patch('/:id/reject', authRequired, adminRequired, rejectSubmission);

module.exports = router;
