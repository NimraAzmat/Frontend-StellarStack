"use client";

import { useState, useEffect } from "react";
import InputField from "@/app/components/InputField";
import SelectField from "@/app/components/SelectField";
import Button from "@/app/components/Button";
require('dotenv').config();
import '@/app/globals.css';
export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    type: "",
  });

  useEffect(() => {
    const fetchJobs = async () => {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/jobs?${queryParams}`, {
        credentials: "include",
      });

      if (!res.ok) return console.error("Failed to fetch jobs");

      const data = await res.json();
      setJobs(data);
    };

    fetchJobs();
  }, [filters]); //   Fetch jobs when filters change

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="job-listings">
      <h2>Find Jobs</h2>

      {/* 🔍 Search & Filter Options */}
      <div className="filters">
        <InputField type="text" name="title" placeholder="Job Title" onChange={handleInputChange} />
        <InputField type="text" name="location" placeholder="Location" onChange={handleInputChange} />
        <InputField type="number" name="salaryMin" placeholder="Min Salary" onChange={handleInputChange} />
        <InputField type="number" name="salaryMax" placeholder="Max Salary" onChange={handleInputChange} />
        <SelectField name="type" onChange={handleInputChange}>
          <option value="">All Types</option>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
          <option value="contract">Contract</option>
        </SelectField>
      </div>

      {/* 🏢 Job Listings */}
      {jobs && jobs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white p-2 shadow rounded-lg border">
              <h3 className="text-lg font-bold">{job.title}</h3>
              <p className="text-gray-600">{job.company} - {job.location}</p>
              <p className="text-green-600 font-semibold">Salary: {job.salary}</p>
              <p className="text-gray-700">Type: {job.type}</p>
              <button
                className="mt-3 w-fit p-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                onClick={() => window.location.href = `/job/${job._id}`}
              >
                View Job
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
}
