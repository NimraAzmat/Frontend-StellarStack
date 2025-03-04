"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import '@/app/globals.css';
import Button from "@/app/components/Button";
import SimpleTable from "@/app/components/SimpleTable";
require('dotenv').config();
export default function RecruiterJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const headers = ["Title", "Company", "Location", "Actions"];
  useEffect(() => {
    setUserId(localStorage.getItem("userId")?.toString());
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/jobs`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch jobs");

        const allJobs = await res.json();
        console.log("Fetched Jobs:", allJobs);

        console.log("Logged-in Recruiter ID:", userId);

        const recruiterJobs = allJobs.filter(job => job.recruiter?._id?.toString() === userId);
        console.log("Filtered Jobs for Recruiter:", recruiterJobs);

        setJobs(recruiterJobs);
      } catch (err) {
        setError(err.message);
      }
    };

    if (userId) {
      fetchJobs();
    }
  }, [userId]); //   Fetch jobs when userId updates

  const handleDelete = async (jobId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/jobs/${jobId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete job");

      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId)); //   Update job list
    } catch (err) {
      setError(err.message);
    }
  };
  const data = jobs.map((job) => ({
    title: job.title,
    company: job.company,
    location: job.location,
    actions: (
      <div className="flex gap-2">
        <Button
          onClick={() => router.push(`/dashboard/edit-job/${job._id}`)}
        >
          Edit
        </Button>
        <Button
          onClick={() => handleDelete(job._id)}
        >
          Delete
        </Button>
        <Button
          onClick={() => router.push(`/dashboard/jobs/${job._id}/applications`)}
        >
          View Applicants
        </Button>
      </div>
    ),
  }));

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">My Jobs</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {jobs.length === 0 ? (
        <p className="text-center text-gray-600">No jobs posted yet.</p>
      ) : (
        <SimpleTable headers={headers} data={data} />
      )}
    </div>
  );
}
