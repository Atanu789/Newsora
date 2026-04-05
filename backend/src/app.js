const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const env = require('./config/env');
const apiLimiter = require('./middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const newsRoutes = require('./routes/newsRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.frontendOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(apiLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/submissions', submissionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
