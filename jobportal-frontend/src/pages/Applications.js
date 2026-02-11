import { useEffect, useState } from "react";

export default function Applications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/applications")
      .then(res => res.json())
      .then(data => {
        setApps(data);   // ✅ THIS is the data (no allApps needed)
      });
  }, []);
  
  return (
    <div className="container">
      <h2>Job Applications</h2>

      {apps.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        apps.map(app => (
          <div key={app._id} style={{border: "1px solid #ccc", padding: "10px", marginBottom: "10px"}}>
            <p><b>Job:</b> {app.jobTitle}</p>
            <p><b>Company:</b> {app.company}</p>
            <p><b>Applicant:</b> {app.applicantName}</p>
            <p><b>Status:</b> {app.status}</p>
          </div>
        ))
      )}
    </div>
  );
}
