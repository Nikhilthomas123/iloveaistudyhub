const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Route for /api/quiz/generate
router.post('/generate', quizController.generateQuizController);

module.exports = router;
