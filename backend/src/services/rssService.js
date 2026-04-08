const Parser = require('rss-parser');

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'AI-News-Bot/1.0'
  }
});

const RSS_SOURCES = [
  { url: 'https://feeds.bbci.co.uk/news/rss.xml', sourceLabel: 'BBC World' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', sourceLabel: 'NYTimes World' },
  { url: 'https://www.hindustantimes.com/feeds/rss/cities/kolkata-news/rssfeed.xml', sourceLabel: 'HT Kolkata' }
];

function extractImageUrl(item) {
  if (item.enclosure?.url) return item.enclosure.url;
  if (Array.isArray(item.enclosure) && item.enclosure[0]?.url) return item.enclosure[0].url;
  if (item.itunes?.image) return item.itunes.image;

  const html = String(item['content:encoded'] || item.content || '');
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || null;
}

async function fetchFromRss() {
  const allItems = [];

  for (const sourceConfig of RSS_SOURCES) {
    const url = sourceConfig.url;
    try {
      const feed = await parser.parseURL(url);
      for (const item of feed.items || []) {
        allItems.push({
          title: item.title,
          content: item.contentSnippet || item.content || '',
          imageUrl: extractImageUrl(item),
          source: sourceConfig.sourceLabel || feed.title || 'RSS',
          sourceUrl: item.link,
          externalId: item.guid || item.link
        });
      }
    } catch (error) {
      continue;
    }
  }

  return allItems;
}

module.exports = {
  fetchFromRss
};
