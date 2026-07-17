const Flashcard = require('../models/Flashcard');

// GET /api/decks/:deckId/flashcards - Get all flashcards for a specific deck
const getFlashcardsByDeck = async (req, res) => {
  try {
    const { deckId } = req.params;
    const flashcards = await Flashcard.find({ deckId });
    res.status(200).json(flashcards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/decks/:deckId/flashcards - Create a flashcard linked to deckId
const createFlashcard = async (req, res) => {
  try {
    const { deckId } = req.params;
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'question and answer are required' });
    }
    const newFlashcard = new Flashcard({ question, answer, deckId });
    const savedFlashcard = await newFlashcard.save();
    res.status(201).json(savedFlashcard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/flashcards/:id - Update question and/or answer
const updateFlashcard = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const updateData = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'At least one of question or answer is required to update' });
    }

    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedFlashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    res.status(200).json(updatedFlashcard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/flashcards/:id - Delete a flashcard
const deleteFlashcard = async (req, res) => {
  try {
    const deletedFlashcard = await Flashcard.findByIdAndDelete(req.params.id);
    if (!deletedFlashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    res.status(200).json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getFlashcardsByDeck,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard
};
