const express = require('express');
const router = express.Router();
const deckRoutes = require('./deckRoutes');
const flashcardRoutes = require('./flashcardRoutes');
const researchResultRoutes = require('./researchResultRoutes');
const quizRoutes = require('./quizRoutes');

// Mount Deck routes under /decks
router.use('/decks', deckRoutes);

// Mount Flashcard routes under /flashcards
router.use('/flashcards', flashcardRoutes);

// Mount ResearchResult routes under /research-results
router.use('/research-results', researchResultRoutes);

// Mount Quiz routes under /quiz
router.use('/quiz', quizRoutes);

module.exports = router;
