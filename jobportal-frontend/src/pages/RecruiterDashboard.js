import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
console.log("DASHBOARD LOADED");

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");

    if (!raw) {
      navigate("/login");
      return;
    }

    const parsed = JSON.parse(raw);

    if (parsed.role !== "recruiter") {
      navigate("/jobs");
      return;
    }

    setUser(parsed);
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dash-container">
      <h1>Welcome Recruiter, {user.name} 👋</h1>
      <div className="logout">
  <button
    className="primary"
    onClick={() => {
      localStorage.removeItem("user");
      navigate("/login");
    }}
  >
    Logout
  </button>
</div>
      <div className="dash-cards">
        <div className="dash-card" onClick={() => navigate("/postjob")}>
          <h2>Post New Job</h2>
        </div>

        <div className="dash-card" onClick={() => navigate("/jobs")}>
          <h2>View My Jobs</h2>
        </div>

        <div className="dash-card" onClick={() => navigate("/applications")}>
          <h2>View Applications</h2>
        </div>
        
      </div>
    </div>
  );
}
