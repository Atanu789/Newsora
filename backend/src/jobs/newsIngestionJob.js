const cron = require('node-cron');
const { ingestNews } = require('../services/newsIngestionService');

function startNewsIngestionJob() {
  cron.schedule('*/15 * * * *', async () => {
    try {
      const result = await ingestNews();
      console.log('News ingestion completed', result);
    } catch (error) {
      console.error('News ingestion failed', error.message);
    }
  });

  // Warm start once on boot.
  ingestNews().catch((error) => {
    console.error('Initial ingestion failed', error.message);
  });
}

module.exports = { startNewsIngestionJob };
