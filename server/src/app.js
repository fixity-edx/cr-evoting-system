const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const candidateRoutes = require('./routes/candidate.routes');
const voteRoutes = require('./routes/vote.routes');
const adminRoutes = require('./routes/admin.routes');
const aiRoutes = require('./routes/ai.routes');
const { errorResponse } = require('./utils/response');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('CR Voting System API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    errorResponse(res, 'Internal Server Error', 500, err);
});

module.exports = app;
