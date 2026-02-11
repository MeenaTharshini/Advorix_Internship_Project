import { useEffect, useState } from "react";
import "../styles/Jobs.css";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const userData = JSON.parse(raw);
        setUser(userData);
      }
    } catch {
      setError("Failed to load user data");
    }
  }, []);

  // Fetch jobs with error handling
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/jobs");
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Load user's applied jobs when user loads
  useEffect(() => {
    if (user) {
      fetchUserApplications();
    }
  }, [user]);

  const fetchUserApplications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/applications");
      const allApps = await response.json();
      const userApps = allApps.filter(app => app.applicant === user.name);
      const userJobIds = userApps.map(app => app.jobId);
      setAppliedJobs(userJobIds);
    } catch {
      // Silently fail - not critical
    }
  };

  if (loading) return <div className="jobs-container"><p className="loading">Loading jobs...</p></div>;
  if (error && !user) return <div className="jobs-container"><p>Error: {error}</p></div>;
  if (!user) return <div className="jobs-container"><p>Please log in to view jobs.</p></div>;

  const applyJob = async (jobId) => {
  try {
    const response = await fetch("http://localhost:5000/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId,
        userId: user._id,   // ⭐ send userId, NOT name
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setAppliedJobs(prev => [...prev, jobId]);
      alert("Applied successfully!");
    } else {
      alert(data.message || "Failed to apply");
    }
  } catch {
    alert("Error applying");
  }
};


  return (
    <div className="jobs-container">
      <h1 className="jobs-heading">Available Jobs</h1>

      {error && jobs.length === 0 && (
        <p className="error">Failed to load jobs: {error}</p>
      )}

      <div className="jobs-grid">
        {jobs.map((job) => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>

            <div className="meta">
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              {job.postedBy && <p><strong>Posted by:</strong> {job.postedBy}</p>}
            </div>

            <p className="desc">{job.description}</p>

            <div className="btn-group">
              {appliedJobs.includes(job._id) ? (
                <button className="btn applied" disabled>
                  Applied ✅
                </button>
              ) : (
                <button
                  className="btn apply"
                  onClick={() => applyJob(job._id)}
                  disabled={loading}
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && !loading && (
        <p className="no-jobs">No jobs available at the moment.</p>
      )}
    </div>
  );
}
