"use client";
import { useEffect, useState } from "react";
import SimpleTable from "@/app/components/SimpleTable";
import '@/app/globals.css';
export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const headers = ["Job Title", "Company", "Location", "Salary", "Type", "Status"];


  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchJobs = async () => {
      try {
        const res = await fetch(`http://localhost:4000/jobs`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch jobs");

        const jobs = await res.json();
        console.log(jobs)

        const userApplications = jobs.reduce((acc, job) => {
          const applicant = job.applicants.find(applicant => applicant._id === userId);
          if (applicant) {
            acc.push({
              jobId: job._id,
              jobTitle: job.title,
              company: job.company,
              location: job.location,
              salary: job.salary,
              type: job.type,
              status: applicant.status,
              recruiter: job.recruiter.name,
            });
          }
          return acc;
        }, []);

        console.log(userApplications); // Log the mapped jobs
        setApplications(userApplications);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJobs();
  }, []);

  // const userId = localStorage.getItem("userId");
  const data = applications.map((app) => ({
    jobTitle: app.jobTitle,
    company: app.company,
    location: app.location,
    salary: app.salary,
    type: app.type,
    status: app.status,
  }));
  return (
    <div className="dashboard-content">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
        My Applications</h2>
      {error && <p className="error">{error}</p>}
      {applications.length === 0 ? (
        <h3>Not applied to job</h3>
      ) : (
        <SimpleTable headers={headers} data={data} />
      )}
    </div>
  );
}
