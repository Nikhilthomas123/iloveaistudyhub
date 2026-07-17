const express = require('express');
const router = express.Router();
const researchResultController = require('../controllers/researchResultController');

// Routes for /api/research-results
router.get('/', researchResultController.getResearchResults);
router.post('/', researchResultController.createResearchResult);
router.post('/generate', researchResultController.generateResearchResult);

// Routes for /api/research-results/:id
router.get('/:id', researchResultController.getResearchResultById);
router.delete('/:id', researchResultController.deleteResearchResult);

module.exports = router;
