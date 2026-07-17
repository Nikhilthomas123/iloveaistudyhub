const { generateQuiz } = require('../services/quiz.service');

const generateQuizController = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    
    // Topic validation
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    // Difficulty validation & default fallback
    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
    let selectedDifficulty = 'Beginner';
    if (difficulty && validDifficulties.includes(difficulty)) {
      selectedDifficulty = difficulty;
    }

    console.log(`Received request to generate quiz for "${topic.trim()}" at ${selectedDifficulty}`);

    const quiz = await generateQuiz(topic.trim(), selectedDifficulty);
    res.status(200).json(quiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: error.message || 'Failed to generate quiz. Please try again.' });
  }
};

module.exports = { generateQuizController };
