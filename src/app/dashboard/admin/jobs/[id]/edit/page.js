"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import InputField from "../../../../../components/InputField";
import SelectField from "../../../../../components/SelectField";
import Button from "../../../../../components/Button";
import '../../../../../globals.css';
export default function EditJobPage() {
  const router = useRouter();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:4000/admin/jobs/${id}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch job details");

        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (id) fetchJob(); //   Fetch job only when ID is available
  }, [id]);


  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:4000/admin/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify(job),
      });

      setMessage("Job updated successfully!");
      setTimeout(() => router.push("/dashboard/admin/jobs"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-content">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
        Edit Job</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      {job ? (
        <form
          onSubmit={handleUpdate}
          className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-700 text-center">Update Job</h2>

          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-medium">Job Title</label>
            <InputField
              type="text"
              value={job.title}
              onChange={(e) => setJob({ ...job, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-medium">Job Description</label>
            <textarea
              placeholder="Enter Job Description"
              value={job.description}
              onChange={(e) => setJob({ ...job, description: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-medium">Company Name</label>
            <InputField
              type="text"
              value={job.company}
              onChange={(e) => setJob({ ...job, company: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-medium">Location</label>
            <InputField
              type="text"
              value={job.location}
              onChange={(e) => setJob({ ...job, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-medium">Salary</label>
            <InputField
              type="number"
              value={job.salary}
              onChange={(e) => setJob({ ...job, salary: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-medium">Job Type</label>
            <SelectField
              value={job.type}
              onChange={(e) => setJob({ ...job, type: e.target.value })}
              options={[
                { value: "full-time", label: "Full-time" },
                { value: "part-time", label: "Part-Time" },
                { value: "contract", label: "Contract" },
              ]}
            />
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
              Update Job
            </Button>
          </div>
        </form>

      ) : (
        <p>Loading job details...</p>
      )}
    </div>
  );
}
