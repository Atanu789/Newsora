const axios = require('axios');
const env = require('../config/env');
const { fetchFromRss } = require('./rssService');
const { processArticleWithAi } = require('./aiService');
const newsModel = require('../models/newsModel');

async function fetchFromGNews() {
  if (!env.gnewsApiKey) return [];

  const url = 'https://gnews.io/api/v4/top-headlines';
  const topics = ['nation', 'business', 'technology', 'sports', 'health', 'entertainment', 'science'];

  const requests = topics.map((topic) =>
    axios
      .get(url, {
        params: {
          token: env.gnewsApiKey,
          country: env.gnewsCountry,
          lang: env.gnewsLanguage,
          topic,
          max: env.gnewsMaxPerTopic
        },
        timeout: 10000
      })
      .catch(() => null)
  );

  const responses = await Promise.all(requests);
  const byExternalId = new Map();

  for (const response of responses) {
    const articles = response?.data?.articles || [];
    for (const article of articles) {
      const sourceUrl = article.url;
      if (!sourceUrl || byExternalId.has(sourceUrl)) continue;

      byExternalId.set(sourceUrl, {
        title: article.title,
        content: article.description || article.content || '',
        imageUrl: article.image || null,
        source: article.source?.name || 'GNews',
        sourceUrl,
        externalId: sourceUrl
      });
    }
  }

  return Array.from(byExternalId.values());
}

async function ingestNews() {
  const [gnewsItems, rssItems] = await Promise.allSettled([fetchFromGNews(), fetchFromRss()]);

  const merged = [
    ...(gnewsItems.status === 'fulfilled' ? gnewsItems.value : []),
    ...(rssItems.status === 'fulfilled' ? rssItems.value : [])
  ].filter((item) => item.title && item.sourceUrl);

  const uniqueByExternalId = new Map();
  for (const item of merged) {
    const externalId = String(item.externalId || item.sourceUrl || '').trim();
    if (!externalId || uniqueByExternalId.has(externalId)) continue;
    uniqueByExternalId.set(externalId, {
      ...item,
      externalId
    });
  }

  let storedCount = 0;
  for (const item of uniqueByExternalId.values()) {
    const exists = await newsModel.findByExternalId(item.externalId);
    if (exists) continue;

    const ai = await processArticleWithAi(`${item.title}\n\n${item.content}`);

    // Copyright-safe storage: save summary-focused content and source link.
    try {
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
    } catch (error) {
      if (error?.code === '23505') continue;
      throw error;
    }
  }

  return { ingested: storedCount };
}

module.exports = {
  ingestNews
};
