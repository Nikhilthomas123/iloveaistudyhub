const { generateText } = require('ai');
const { models } = require('../../config/models');

async function runWriterAgent(topic, researchNotes) {
    const result = await generateText({
        model: models.writer,
        system: `
You are a writer agent.

Your job:
- Turn research notes into a clear, polished, readable report.
- Use headings and bullet points where helpful.
- Be concise but informative.
- Do not invent facts not present in the notes.
`,
        prompt: `
Topic:
${topic}

Research Notes:
${researchNotes}

Write a high-quality report using the following structure with exact tags:

[EXECUTIVE_SUMMARY]
<A concise summary of the topic and research findings>

[KEY_FINDINGS]
- <Key point 1>
- <Key point 2>
- <Key point 3>

[CITATIONS]
- <Citation/Source 1>
- <Citation/Source 2>
`,
        maxTokens: 1500
    });

    return result.text;
}

module.exports = { runWriterAgent };