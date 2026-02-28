require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://smis-jobportal-frontend.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());

// API routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

// ✅ Serve React build
app.use(express.static(path.join(__dirname, "build")));

// ✅ React SPA fallback (FIXED)
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  } else {
    next();
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch(err => console.log(err));