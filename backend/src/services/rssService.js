const Parser = require('rss-parser');

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'AI-News-Bot/1.0'
  }
});

const RSS_SOURCES = [
  { url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml', sourceLabel: 'HT India' },
  { url: 'https://www.hindustantimes.com/feeds/rss/cities/kolkata-news/rssfeed.xml', sourceLabel: 'HT Kolkata' },
  { url: 'https://www.thehindu.com/news/national/feeder/default.rss', sourceLabel: 'The Hindu National' },
  { url: 'https://www.thehindu.com/news/cities/feeder/default.rss', sourceLabel: 'The Hindu Cities' },
  { url: 'https://indianexpress.com/section/india/feed/', sourceLabel: 'Indian Express India' },
  { url: 'https://indianexpress.com/section/cities/feed/', sourceLabel: 'Indian Express Cities' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms', sourceLabel: 'TOI India' },
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/66949542.cms', sourceLabel: 'TOI World' },
  { url: 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml', sourceLabel: 'BBC India' },
  { url: 'https://feeds.bbci.co.uk/news/rss.xml', sourceLabel: 'BBC World' }
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
