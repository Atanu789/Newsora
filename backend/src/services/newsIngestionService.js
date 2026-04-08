const axios = require('axios');
const env = require('../config/env');
const { fetchFromRss } = require('./rssService');
const { processArticleWithAi } = require('./aiService');
const newsModel = require('../models/newsModel');

async function fetchFromGNews() {
  if (!env.gnewsApiKey) return [];

  const url = 'https://gnews.io/api/v4/top-headlines';
  const response = await axios.get(url, {
    params: {
      token: env.gnewsApiKey,
      lang: 'en',
      max: 30
    },
    timeout: 10000
  });

  return (response.data.articles || []).map((article) => ({
    title: article.title,
    content: article.description || article.content || '',
    imageUrl: article.image || null,
    source: article.source?.name || 'GNews',
    sourceUrl: article.url,
    externalId: article.url
  }));
}

async function ingestNews() {
  const [gnewsItems, rssItems] = await Promise.allSettled([fetchFromGNews(), fetchFromRss()]);

  const merged = [
    ...(gnewsItems.status === 'fulfilled' ? gnewsItems.value : []),
    ...(rssItems.status === 'fulfilled' ? rssItems.value : [])
  ].filter((item) => item.title && item.sourceUrl);

  let storedCount = 0;
  for (const item of merged) {
    const exists = await newsModel.findByExternalId(item.externalId);
    if (exists) continue;

    const ai = await processArticleWithAi(`${item.title}\n\n${item.content}`);

    // Copyright-safe storage: save summary-focused content and source link.
    await newsModel.create({
      title: item.title,
      content: item.content?.slice(0, 500),
      imageUrl: item.imageUrl || null,
      summary: ai.summary,
      category: ai.category,
      tags: ai.tags,
      source: item.source,
      sourceUrl: item.sourceUrl,
      externalId: item.externalId
    });
    storedCount += 1;
  }

  return { ingested: storedCount };
}

module.exports = {
  ingestNews
};
