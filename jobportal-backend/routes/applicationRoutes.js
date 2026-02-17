const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const Application = require("../models/Application");
const Job = require("../models/Job");

// ✅ Apply for job
router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
});

// ✅ Recruiter sees applications
router.get("/recruiter/:recruiterId", async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.params.recruiterId });
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({
      jobId: { $in: jobIds }
    })
      .populate("jobId", "title company")
      .populate("userId", "name email");

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  router.post("/apply", auth, async (req, res) => {
  try {
    const {
      jobId,
      fullName,
      email,
      phone,
      resumeLink,
      coverLetter,
      skills,
      experience
    } = req.body;

    const newApplication = new Application({
      userId: req.user.id,
      jobId,
      fullName,
      email,
      phone,
      resumeLink,
      coverLetter,
      skills,
      experience
    });

    await newApplication.save();

    res.status(201).json({ message: "Application submitted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
