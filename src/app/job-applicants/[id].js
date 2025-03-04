"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function JobApplicantsPage() {
  const { id } = useParams(); // Get job ID from URL
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await fetch(`http://localhost:4000/applications/${id}/applicants`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch applicants");

        const data = await res.json();
        setApplicants(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchApplicants();
  }, [id]);

  return (
    <div className="dashboard-content">
      <h2>Job Applicants</h2>
      {error && <p className="error">{error}</p>}
      {applicants.length === 0 ? (
        <p>No one has applied yet.</p>
      ) : (
        <ul>
          {applicants.map((app) => (
            <li key={app._id}>
              <h3>{app.name}</h3>
              <p>Email: {app.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
