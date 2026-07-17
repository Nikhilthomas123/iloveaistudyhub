const { runResearchAgent } = require('../agents/agents/researchAgent');
const { runWriterAgent } = require('../agents/agents/writerAgent');
const { runReviewerAgent } = require('../agents/agents/reviewerAgent');

async function runResearchPipeline(topic) {
  const researchNotes = await runResearchAgent(topic);
  const draft = await runWriterAgent(topic, researchNotes);
  const reviewResult = await runReviewerAgent(topic, researchNotes, draft);

  return {
    topic,
    researchNotes,
    draft,
    reviewResult
  };
}

module.exports = { runResearchPipeline };
