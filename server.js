require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const app = express();

// connect to DB
connectDB();

// middleware
app.use(cors());
app.use(bodyParser.json());

// routes
app.use('/api/resumes', require('./routes/resume'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
