"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import '@/app/globals.css';
import InputField from "@/app/components/InputField";
import Button from "@/app/components/Button";
import SelectField from "@/app/components/SelectField";
require('dotenv').config();
export default function CreateJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [type, setType] = useState("full-time");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePostJob = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Ensure recruiter authentication
        },
        credentials: "include",
        body: JSON.stringify({ title, description, company, location, salary, type }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Job posting failed");

      setMessage("Job posted successfully!");
      setTimeout(() => router.push("/dashboard/jobs"), 2000); // Redirect after success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-content">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
        Post a Job</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handlePostJob} className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4"
      >
        <div className="space-y-2">
          <label className="block text-gray-600 text-sm font-medium">Job Title</label>
          <InputField
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-600 text-sm font-medium">Job Description</label>
          <textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-600 text-sm font-medium">Company Name</label>
          <InputField
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-600 text-sm font-medium">Location</label>
          <InputField
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-600 text-sm font-medium">Salary</label>
          <InputField
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-600 text-sm font-medium">Job Type</label>
          <SelectField value={type} onChange={(e) => setType(e.target.value)} options={[
            { value: "full-time", label: "Full-Time" },
            { value: "part-time", label: "Part-Time" },
            { value: "contract", label: "Contract" },
          ]}>
          </SelectField>
        </div>
        <div className="flex justify-center">
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
            Post Job</Button>
        </div>

      </form>
    </div>
  );
}
