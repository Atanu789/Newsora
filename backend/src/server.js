const app = require('./app');
const env = require('./config/env');
const { startNewsIngestionJob } = require('./jobs/newsIngestionJob');

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});

startNewsIngestionJob();
