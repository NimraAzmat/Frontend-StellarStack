"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
require('dotenv').config();
export default function JobDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJobAndCheckApplicationStatus = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/jobs/${id}`, {
          credentials: "include",
        });
        if (!res.ok) {
          if (res.status === 404) {
            setError("Job not found.");
          } else {
            throw new Error("Failed to fetch job details");
          }
        } else {
          const jobData = await res.json();
          console.log("Job data", jobData);
          setJob(jobData);
          const user = localStorage.getItem("userId");
          console.log(jobData._id, user);
          const applicationStatusRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/applications/${jobData._id}/check/${user}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
            credentials: "include",
          });

          if (!applicationStatusRes.ok) throw new Error("Failed to check application status");

          const applicationStatusData = await applicationStatusRes.json();
          setApplied(applicationStatusData.applied);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobAndCheckApplicationStatus();
    } else {
      setError("No Job ID provided");
      setLoading(false);
    }
  }, [id]);
  // useEffect(() => {
  //   const fetchJob = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/jobs/${id}`, {
  //         credentials: "include",
  //       });
  //       if (!res.ok) {
  //         if (res.status === 404) {
  //           setError("Job not found.");
  //         } else {
  //           throw new Error("Failed to fetch job details");
  //         }
  //       } else {
  //         const data = await res.json();
  //         console.log("Job data", data);
  //         setJob(data);
  //       }
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (id && job) {

  //     fetchJob();
  //     checkApplicationStatus();
  //   } else {
  //     setError("No Job ID provided");
  //     setLoading(false);
  //   }
  // }, [id, job]);
  // useEffect(() => {
  //   const checkApplicationStatus = async () => {
  //     try {
  //       console.log("Checking application status id", id, job);
  //       const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/applications/${id}/check`, {
  //         method: "GET",
  //         headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
  //         credentials: "include",
  //       });

  //       if (!res.ok) throw new Error("Failed to check application status");

  //       const data = await res.json();
  //       setApplied(data.applied);
  //     } catch (err) {
  //       setError(err.message);
  //     }
  //   };

  //   if (id) {
  //     checkApplicationStatus();
  //   }
  // }, [id]);

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/applications/${id}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Application failed");

      setMessage("Application submitted successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-content">
        <p>Loading job details...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      {/* Error and Success Messages */}
      {error && <p className="text-red-600 bg-red-100 p-2 rounded">{error}</p>}
      {message && <p className="text-green-600 bg-green-100 p-2 rounded">{message}</p>}

      {job ? (
        <>
          <h2 className="text-2xl font-bold text-gray-900 text-center">{job.title}</h2>
          <p className="text-green-700 font-semibold text-lg text-center">{job.company}</p>

          <hr className="my-4" />

          <p className="text-gray-800 mt-4 p-4 bg-gray-100 rounded-lg">{job.description}</p>

          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-lg font-semibold">Salary: <span className="text-green-600">{job.salary}</span></p>
            <p className="text-lg font-semibold">Type: <span className="text-blue-600">{job.type}</span></p>
            <p className="text-lg font-semibold">Location: <span className="text-blue-600">{job.location}</span></p>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <p className="text-gray-700">Posted By: <span className="font-semibold">{job.recruiter.name}</span></p>
            <p className="text-gray-700">Contact: <span className="font-semibold">{job.recruiter.email}</span></p>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            className={`mt-6 w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition ${applied ? "bg-gray-300 cursor-not-allowed" : ""}`}
            disabled={applied}
          >
            {applied ? "Applied" : "Apply Now"}
          </button>
        </>
      ) : (
        <p className="text-gray-500">Loading job details...</p>
      )}
    </div>


  );
}
