const express = require('express');
const router = express.Router({ mergeParams: true }); // Retain req.params from parent router (:id)
const commentController = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateComment } = require('../middleware/validateMiddleware');

router.use(authenticateToken);

router.get('/', commentController.getComments);
router.post('/', validateComment, commentController.addComment);

module.exports = router;
