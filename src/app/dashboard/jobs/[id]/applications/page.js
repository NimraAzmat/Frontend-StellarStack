"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/app/components/Button";
import SimpleTable from "@/app/components/SimpleTable";
require('dotenv').config();
export default function ManageApplicationsPage() {
  const router = useRouter();
  const { id } = useParams(); // Job ID
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState("");
  const headers = ["Name", "Email", "Status", "Actions"];

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/applications/${id}/applicants`, {
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

  const handleUpdateStatus = async (applicantId, status) => {
    try {
      console.log(applicantId)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/applications/${id}/applicants/${applicantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error(`Failed to ${status} application`);

      setApplicants(prev =>
        prev.map(applicant =>
          applicant._id === applicantId ? { ...applicant, status } : applicant
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };
  console.log(applicants)
  const data = applicants.map((applicant) => ({

    name: applicant.name,
    email: applicant.email,
    status: applicant.status || "Pending",
    actions: (
      <div className="flex gap-2">
        <Button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => handleUpdateStatus(applicant._id, "accepted")}
        >
          Accept
        </Button>
        <Button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={() => handleUpdateStatus(applicant._id, "rejected")}
        >
          Reject
        </Button>
      </div>
    ),
  }));


  return (
    <div className="dashboard-content">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
        Manage Job Applications</h2>
      {error && <p className="error">{error}</p>}
      {applicants.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <SimpleTable headers={headers} data={data} />
      )}

      <button onClick={() => router.push("/dashboard/jobs")}>Back to Jobs</button>
    </div>
  );
}
