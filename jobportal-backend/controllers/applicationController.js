exports.applyJob = async (req, res) => {
  try {
    const { jobId, fullName, email, phone, resumeLink, coverLetter, skills, experience } = req.body;

    // Optional: validate required fields here

    const application = new Application({
      userId: req.user.id, // from auth middleware
      jobId,
      fullName,
      email,
      phone,
      resumeLink,
      coverLetter,
      skills,
      experience
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully" });

  } catch (error) {
    console.error(error); // helps debug
    res.status(500).json({ error: error.message });
  }
};
