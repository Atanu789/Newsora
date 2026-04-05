const axios = require('axios');
const env = require('../config/env');

const ALLOWED_CATEGORIES = [
  'Environmental',
  'Social',
  'Financial',
  'Political',
  'Campaigning',
  'Tech',
  'Health'
];

function normalizeAiPayload(payload) {
  return {
    summary: String(payload.summary || '').slice(0, 400),
    category: ALLOWED_CATEGORIES.includes(payload.category) ? payload.category : 'Social',
    tags: Array.isArray(payload.tags) ? payload.tags.slice(0, 8).map((tag) => String(tag)) : []
  };
}

async function withOpenAi(articleText) {
  const prompt = `Input: article text\n\nOutput JSON:\n{\n\"summary\": \"\",\n\"category\": \"\",\n\"tags\": []\n}\n\nArticle:\n${articleText.slice(0, 6000)}`;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2
    },
    {
      headers: {
        Authorization: `Bearer ${env.openAiApiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const parsed = JSON.parse(response.data.choices[0].message.content);
  return normalizeAiPayload(parsed);
}

async function withGemini(articleText) {
  const prompt = `Return only JSON with keys summary, category, tags. summary max 3 lines. Allowed categories: ${ALLOWED_CATEGORIES.join(', ')}. Article: ${articleText.slice(0, 6000)}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.geminiApiKey}`;
  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }]
  });

  const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  const parsed = JSON.parse(text);
  return normalizeAiPayload(parsed);
}

async function processArticleWithAi(articleText) {
  if (!articleText) {
    return {
      summary: '',
      category: 'Social',
      tags: []
    };
  }

  try {
    if (env.aiProvider === 'gemini') {
      return await withGemini(articleText);
    }
    return await withOpenAi(articleText);
  } catch (error) {
    return {
      summary: articleText.slice(0, 280),
      category: 'Social',
      tags: ['news']
    };
  }
}

module.exports = {
  processArticleWithAi,
  ALLOWED_CATEGORIES
};
