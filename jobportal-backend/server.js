require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://smis-jobportal.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.get('/api/test', (req, res) => {
  res.send('Backend is working!');
});
// Serve React frontend
app.use(express.static(path.join(__dirname, "../jobportal-frontend/build")));

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(
    path.join(__dirname, "../jobportal-frontend/build", "index.html")
  );
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// MongoDB + Server start
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected Successfully");

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
})
.catch(err => console.log(err));