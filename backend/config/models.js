const { createOpenAI } = require('@ai-sdk/openai');

const customFetch = async (url, options) => {
  if (options && options.body) {
    try {
      const body = JSON.parse(options.body);
      if (body.max_completion_tokens) {
        body.max_tokens = body.max_completion_tokens;
      }
      if (!body.max_tokens) {
        body.max_tokens = 1500;
      }
      options.body = JSON.stringify(body);
    } catch (e) {
      // ignore
    }
  }
  return fetch(url, options);
};

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  compatibility: 'compatible',
  fetch: customFetch,
});

const wrapModel = (model) => {
  const original = model.doGenerate.bind(model);
  model.doGenerate = async (opts) => {
    const res = await original(opts);
    if (res.content && Array.isArray(res.content)) {
      const txt = res.content.find(i => i.type === 'text');
      if (txt) res.text = txt.text;
    }
    return res;
  };
  return model;
};

const models = {
  research: wrapModel(openrouter.chat('openrouter/free')),
  reviewer: wrapModel(openrouter.chat('openrouter/free')),
  writer: wrapModel(openrouter.chat('openrouter/free'))
};

module.exports = { models };



