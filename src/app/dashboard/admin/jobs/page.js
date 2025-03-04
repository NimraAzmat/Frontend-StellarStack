"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../components/Button";
import Table from "@/app/components/Table";
import '../../../globals.css';
export default function ManageJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const columns = [
    { key: "title", label: "Job Title" },
    { key: "company", label: "Company" },
    { key: "location", label: "Location" },
    { key: "recruiterName", label: "Recruiter" },
    { key: "salary", label: "Salary" },
    { key: "type", label: "Type" },
  ];
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`http://localhost:4000/admin/jobs`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch jobs");

        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    try {
      await fetch(`http://localhost:4000/admin/jobs/${jobId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        credentials: "include",
      });

      setJobs(jobs.filter(job => job._id !== jobId));
    } catch (err) {
      setError(err.message);
    }
  };

  const actions = [
    {
      label: "Edit",
      className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700",
      onClick: (id) => router.push(`/dashboard/admin/jobs/${id}/edit`),
    },
    {
      label: "Delete",
      className: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700",
      onClick: handleDelete,
    },
  ];
  console.log(jobs);
  const tableData = jobs.map((job) => ({
    _id: job._id,
    title: job.title,
    company: job.company,
    location: job.location,
    recruiterName: job.recruiter.name,
    salary: job.salary,
    type: job.type,
  }));
  return (
    <div className="dashboard-content">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
        Manage Jobs</h2>
      {error && <p className="error">{error}</p>}
      {jobs.length === 0 ? (
        <p className="text-red-500 text-center mb-4">No jobs found.</p>
      ) : (
        <Table columns={columns} data={tableData} actions={actions} />
      )}
    </div>
  );
}
