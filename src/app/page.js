"use client";

import { useState, useEffect } from "react";
import InputField from "@/app/components/InputField";
import SelectField from "@/app/components/SelectField";
import Button from "@/app/components/Button";

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
      const res = await fetch(`http://localhost:4000/jobs?${queryParams}`, {
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
      {jobs.length === 0 ? <p>No jobs found.</p> : (
        <ul>
          {jobs.map((job) => (
            <li key={job._id}>
              <h3>{job.title}</h3>
              <p>{job.company} - {job.location}</p>
              <p>💰 Salary: {job.salary}</p>
              <p>📌 Type: {job.type}</p>
              <Button onClick={() => window.location.href = `/job/${job._id}`}>View Job</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
