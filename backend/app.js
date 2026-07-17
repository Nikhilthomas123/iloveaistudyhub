const dotenv = require('dotenv');
const envConfig = dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Override MONGODB_URI with the value in .env if present to avoid Atlas whitelisting issues
if (envConfig.parsed && envConfig.parsed.MONGODB_URI) {
  process.env.MONGODB_URI = envConfig.parsed.MONGODB_URI;
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('Error: MONGODB_URI is not defined in the environment variables.');
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    const localFallbackURI = 'mongodb://localhost:27017/backend';
    if (mongoURI !== localFallbackURI) {
      console.log(`Falling back to local MongoDB at: ${localFallbackURI}`);
      mongoose
        .connect(localFallbackURI)
        .then(() => {
          console.log('Successfully connected to local MongoDB.');
        })
        .catch((localErr) => {
          console.error('Local MongoDB connection error:', localErr);
        });
    }
  });

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Register all API routes
const apiRouter = require('./routers');
app.use('/api', apiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
