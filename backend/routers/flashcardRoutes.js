const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashcardController');

// Routes for /api/flashcards/:id
router.put('/:id', flashcardController.updateFlashcard);
router.delete('/:id', flashcardController.deleteFlashcard);

module.exports = router;
