"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/app/components/InputField";
import SelectField from "@/app/components/SelectField";
import Button from "@/app/components/Button";

import '@/app/globals.css';
export default function Dashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    type: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      router.push("/login");
    } else {
      setUserRole(role);
    }

    setLoading(false);
  }, [router]);

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
  }, [filters]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
    await fetch(`http://localhost:4000/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className='with-sidebar'>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>Dashboard</h2>
          <ul>
            <li onClick={() => router.push("/dashboard")}>Home</li>
            {userRole === "recruiter" && (
              <>
                <li onClick={() => router.push("/dashboard/jobs")}>My Jobs</li>
                <li onClick={() => router.push("/dashboard/create-job")}>Post Job</li>
                {/* <li onClick={() => router.push("/dashboard/settings")}>Settings</li> */}

              </>
            )}
            {userRole === "employee" && (
              <>
                <li onClick={() => router.push("/dashboard/applications")}>My Applications</li>
                {/* <li onClick={() => router.push("/dashboard/settings")}>Settings</li> */}
              </>
            )}
            <li onClick={() => router.push("/dashboard/settings")}>Settings</li>

            <li onClick={handleLogout} className="logout-btn">Logout</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-semibold">Welcome, {userRole}!</h1>
          <p className="text-gray-600">Select an option to get started.</p>

          {/* Job Listings Section */}
          {userRole === "employee" && (
            <div className="mt-6 bg-white shadow-md p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Find Jobs</h2>

              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <InputField
                  type="text"
                  name="title"
                  placeholder="Job Title"
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                />
                <InputField
                  type="text"
                  name="location"
                  placeholder="Location"
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                />
                <InputField
                  type="text"
                  name="salaryMin"
                  placeholder="Min Salary"
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                />
                <InputField
                  type="text"
                  name="salaryMax"
                  placeholder="Max Salary"
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                />
                <SelectField name="type" onChange={handleInputChange} className="p-2 border rounded" options={[
                  { value: "", label: "All Types" },
                  { value: "full-time", label: "Full-Time" },
                  { value: "part-time", label: "Part-Time" },
                  { value: "contract", label: "Contract" },
                ]} />
              </div>

              {/* Job Listings */}
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
          )}
        </main>
      </div >  </div >
  );
}
