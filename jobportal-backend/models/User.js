const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['seeker', 'recruiter'],
    default: 'seeker'
  },
});

// ✅ THIS LINE PREVENTS OverwriteModelError
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
