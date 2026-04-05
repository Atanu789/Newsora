const Parser = require('rss-parser');

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'AI-News-Bot/1.0'
  }
});

const RSS_SOURCES = [
  'https://feeds.bbci.co.uk/news/rss.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml'
];

async function fetchFromRss() {
  const allItems = [];

  for (const url of RSS_SOURCES) {
    try {
      const feed = await parser.parseURL(url);
      for (const item of feed.items || []) {
        allItems.push({
          title: item.title,
          content: item.contentSnippet || item.content || '',
          source: feed.title || 'RSS',
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
