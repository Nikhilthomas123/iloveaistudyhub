const ResearchResult = require('../models/ResearchResult');
const { runResearchPipeline } = require('../services/orchestrator');

// GET /api/research-results - Fetch all saved research results for a userId
const getResearchResults = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId query parameter is required' });
    }
    const results = await ResearchResult.find({ userId });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/research-results - Save a research result
const createResearchResult = async (req, res) => {
  try {
    const { topic, content, userId, deckId } = req.body;
    if (!topic || !content || !userId) {
      return res.status(400).json({ error: 'topic, content, and userId are required' });
    }
    const newResult = new ResearchResult({ topic, content, userId, deckId });
    const savedResult = await newResult.save();
    res.status(201).json(savedResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/research-results/:id - Fetch a single research result
const getResearchResultById = async (req, res) => {
  try {
    const result = await ResearchResult.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Research result not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/research-results/:id - Delete a research result
const deleteResearchResult = async (req, res) => {
  try {
    const deletedResult = await ResearchResult.findByIdAndDelete(req.params.id);
    if (!deletedResult) {
      return res.status(404).json({ error: 'Research result not found' });
    }
    res.status(200).json({ message: 'Research result deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to parse reviewer agent output
function parseReviewResult(reviewResult) {
  let feedback = [];
  let draft = '';
  
  if (reviewResult) {
    const feedbackIndex = reviewResult.indexOf('REVIEW_FEEDBACK:');
    const draftIndex = reviewResult.indexOf('FINAL_DRAFT:');
    
    if (feedbackIndex !== -1 && draftIndex !== -1) {
      const feedbackText = reviewResult.slice(feedbackIndex + 'REVIEW_FEEDBACK:'.length, draftIndex).trim();
      draft = reviewResult.slice(draftIndex + 'FINAL_DRAFT:'.length).trim();
      
      feedback = feedbackText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./))
        .map(line => line.replace(/^[-*\s]+/, '').replace(/^\d+\.\s+/, ''));
    } else {
      draft = reviewResult;
    }
  }
  
  return { feedback, draft };
}

function parseStructuredDraft(draftText) {
  let summary = '';
  let bullets = [];
  let citations = [];

  if (draftText) {
    const summaryIndex = draftText.indexOf('[EXECUTIVE_SUMMARY]');
    const findingsIndex = draftText.indexOf('[KEY_FINDINGS]');
    const citationsIndex = draftText.indexOf('[CITATIONS]');

    if (summaryIndex !== -1 && findingsIndex !== -1) {
      summary = draftText.slice(summaryIndex + '[EXECUTIVE_SUMMARY]'.length, findingsIndex).trim();
    }
    
    if (findingsIndex !== -1) {
      const findingsEnd = citationsIndex !== -1 ? citationsIndex : draftText.length;
      const findingsText = draftText.slice(findingsIndex + '[KEY_FINDINGS]'.length, findingsEnd).trim();
      bullets = findingsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./))
        .map(line => line.replace(/^[-*\s]+/, '').replace(/^\d+\.\s+/, ''));
    }

    if (citationsIndex !== -1) {
      const citationsText = draftText.slice(citationsIndex + '[CITATIONS]'.length).trim();
      citations = citationsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-') || line.startsWith('*') || line.match(/^\d+\./))
        .map(line => line.replace(/^[-*\s]+/, '').replace(/^\d+\.\s+/, ''));
    }
  }

  // Fallbacks in case tags are missing or failed to parse
  if (!summary) {
    summary = draftText ? draftText.split('\n').filter(line => line.trim()).slice(0, 3).join(' ') : 'No summary generated.';
  }
  if (bullets.length === 0) {
    bullets = draftText
      ? draftText
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('-') || line.startsWith('*'))
          .map(line => line.replace(/^[-*\s]+/, ''))
          .slice(0, 5)
      : [];
  }
  if (bullets.length === 0) {
    bullets = ['No key findings extracted. See full report.'];
  }
  if (citations.length === 0) {
    citations = ['AI Research Agent', 'StudyBuddy Citation'];
  }

  return { summary, bullets, citations };
}

// POST /api/research-results/generate - Runs the AI research agent pipeline and returns the result
const generateResearchResult = async (req, res) => {
  try {
    const { topic, userId, deckId } = req.body;
    if (!topic || !userId) {
      return res.status(400).json({ error: 'topic and userId are required' });
    }

    console.log(`Running research pipeline for topic: "${topic}"...`);
    const pipelineData = await runResearchPipeline(topic);

    // Parse the review result for structured findings
    const { feedback, draft } = parseReviewResult(pipelineData.reviewResult);

    // Format the research findings as structured JSON inside content
    const structuredContent = parseStructuredDraft(draft || pipelineData.draft);

    const newResult = new ResearchResult({
      topic,
      content: JSON.stringify(structuredContent),
      userId,
      deckId
    });

    const savedResult = await newResult.save();
    res.status(201).json(savedResult);
  } catch (error) {
    console.error('Error in generateResearchResult:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getResearchResults,
  createResearchResult,
  getResearchResultById,
  deleteResearchResult,
  generateResearchResult
};
