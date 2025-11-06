const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
if (!process.env.MONGO_URI) {
  console.error('ERROR: MONGO_URI environment variable is not set');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
const incidentsRouter = require('./routes/incidents');
const excelRouter = require('./routes/excel');
const employeesRouter = require('./routes/employees');
app.use('/api/incidents', incidentsRouter);
app.use('/api/excel', excelRouter);
app.use('/api/employees', employeesRouter);

// Test route
app.get('/', (req, res) => {
  res.send('Incident Reports API is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});