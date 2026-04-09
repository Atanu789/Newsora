const axios = require('axios');
const env = require('../config/env');

const ALLOWED_CATEGORIES = [
  'World',
  'Election',
  'State News',
  'Sports',
  'Entertainment',
  'Environmental',
  'Financial',
  'Campaigning',
  'Tech',
  'Health'
];

const CATEGORY_ALIASES = {
  trending: '',
  latest: '',
  social: 'World',
  world: 'World',
  international: 'World',
  entertainment: 'Entertainment',
  cinema: 'Entertainment',
  movie: 'Entertainment',
  movies: 'Entertainment',
  celebrity: 'Entertainment',
  'state news': 'State News',
  state: 'State News',
  local: 'State News',
  election: 'Election',
  elections: 'Election',
  politics: 'Election',
  political: 'Election',
  business: 'Financial',
  finance: 'Financial',
  economic: 'Financial',
  sports: 'Sports',
  technology: 'Tech'
};

const SUPPORTED_LANGUAGE_CODES = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'or', 'ur', 'ne', 'as'];

const CATEGORY_KEYWORDS = {
  World: ['world', 'global', 'international', 'diplomatic', 'foreign affairs', 'un', 'united nations', 'geopolitics'],
  Election: ['election', 'poll', 'vote', 'voter', 'ballot', 'candidate', 'campaign trail', 'constituency', 'assembly election', 'lok sabha'],
  'State News': ['kolkata', 'west bengal', 'mumbai', 'maharashtra', 'chennai', 'tamil nadu', 'hyderabad', 'karnataka', 'kerala', 'district', 'municipal', 'state govt'],
  Sports: ['sport', 'sports', 'cricket', 'football', 'fifa', 'ipl', 'olympic', 'athlete', 'tournament', 'match', 'league'],
  Entertainment: ['entertainment', 'film', 'movie', 'cinema', 'series', 'music', 'celebrity', 'bollywood', 'hollywood', 'showbiz'],
  Tech: ['tech', 'technology', 'ai', 'artificial intelligence', 'software', 'startup', 'cyber', 'chip', 'smartphone', 'internet'],
  Health: ['health', 'hospital', 'medical', 'medicine', 'vaccine', 'disease', 'doctor', 'wellness', 'covid'],
  Financial: ['finance', 'financial', 'economy', 'economic', 'market', 'stock', 'investment', 'inflation', 'bank', 'gdp', 'business'],
  Environmental: ['climate', 'environment', 'pollution', 'emission', 'wildfire', 'flood', 'drought', 'sustainability', 'renewable'],
  Campaigning: ['campaign', 'protest', 'activist', 'rally', 'petition', 'advocacy', 'boycott', 'movement']
};

const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'Hindi',
  bn: 'Bengali',
  ta: 'Tamil',
  te: 'Telugu',
  mr: 'Marathi',
  gu: 'Gujarati',
  kn: 'Kannada',
  ml: 'Malayalam',
  pa: 'Punjabi',
  or: 'Odia',
  ur: 'Urdu',
  ne: 'Nepali',
  as: 'Assamese'
};

function clampSummary(text) {
  const normalized = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) return '';

  const maxLength = 260;
  if (normalized.length <= maxLength) return normalized;

  const cut = normalized.slice(0, maxLength);
  const sentenceEnd = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  if (sentenceEnd > 120) {
    return cut.slice(0, sentenceEnd + 1).trim();
  }

  return `${cut.trimEnd()}...`;
}

function fallbackSummaryFromText(articleText) {
  const cleaned = String(articleText || '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return 'Summary unavailable right now. Open source to read full details.';

  const compact = cleaned.slice(0, 320);
  const sentenceEnd = Math.max(compact.indexOf('. '), compact.indexOf('! '), compact.indexOf('? '));
  if (sentenceEnd > 60) {
    return compact.slice(0, sentenceEnd + 1).trim();
  }

  return clampSummary(compact);
}

function normalizeAiPayload(payload) {
  const safeCategory = normalizeCategoryInput(payload.category) || 'World';

  const tags = Array.isArray(payload.tags)
    ? payload.tags
        .map((tag) => String(tag || '').trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 8)
    : [];

  return {
    summary: clampSummary(payload.summary),
    category: safeCategory,
    tags
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
      category: 'World',
      tags: []
    };
  }

  try {
    let result;
    if (env.aiProvider === 'gemini') {
      result = await withGemini(articleText);
    } else {
      result = await withOpenAi(articleText);
    }

    return {
      ...result,
      summary: result.summary || fallbackSummaryFromText(articleText),
      category:
        result.category === 'World'
          ? classifyArticleCategory(articleText)
          : result.category
    };
  } catch (error) {
    return {
      summary: fallbackSummaryFromText(articleText),
      category: classifyArticleCategory(articleText),
      tags: ['news']
    };
  }
}

function classifyArticleCategory(text) {
  const content = String(text || '').toLowerCase();
  if (!content) return 'World';

  const categoryByScore = Object.entries(CATEGORY_KEYWORDS).map(([category, keywords]) => {
    let score = 0;
    for (const keyword of keywords) {
      if (content.includes(keyword)) score += 1;
    }
    return { category, score };
  });

  categoryByScore.sort((a, b) => b.score - a.score);
  return categoryByScore[0]?.score > 0 ? categoryByScore[0].category : 'World';
}

function normalizeLanguageCode(languageCode) {
  const code = String(languageCode || 'en').toLowerCase();
  return SUPPORTED_LANGUAGE_CODES.includes(code) ? code : 'en';
}

function normalizeCategoryInput(category) {
  const raw = String(category || '').trim();
  if (!raw) return undefined;

  const exact = ALLOWED_CATEGORIES.find((name) => name.toLowerCase() === raw.toLowerCase());
  if (exact) return exact;

  const alias = CATEGORY_ALIASES[raw.toLowerCase()];
  if (typeof alias === 'string') {
    if (!alias) return undefined;
    const normalizedAlias = ALLOWED_CATEGORIES.find((name) => name.toLowerCase() === alias.toLowerCase());
    return normalizedAlias || undefined;
  }

  return undefined;
}

async function translateText(text, languageCode) {
  const safeText = String(text || '').trim();
  const target = normalizeLanguageCode(languageCode);
  if (!safeText || target === 'en') return safeText;

  const languageName = LANGUAGE_NAMES[target] || 'English';

  try {
    if (env.aiProvider === 'gemini') {
      const prompt = `Translate the following text to ${languageName}. Return only translated plain text with no extra notes. Text: ${safeText.slice(0, 1600)}`;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.geminiApiKey}`;
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }]
      });
      return String(response.data.candidates?.[0]?.content?.parts?.[0]?.text || safeText).trim();
    }

    const prompt = `Translate this text to ${languageName}. Return only translated plain text.\n\n${safeText.slice(0, 1600)}`;
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1
      },
      {
        headers: {
          Authorization: `Bearer ${env.openAiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return String(response.data.choices?.[0]?.message?.content || safeText).trim();
  } catch (error) {
    return safeText;
  }
}

module.exports = {
  processArticleWithAi,
  ALLOWED_CATEGORIES,
  SUPPORTED_LANGUAGE_CODES,
  classifyArticleCategory,
  normalizeLanguageCode,
  normalizeCategoryInput,
  translateText
};
