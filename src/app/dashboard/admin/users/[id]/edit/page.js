"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import InputField from "@/app/components/InputField";
import '@/app/globals.css';
import SelectField from "@/app/components/SelectField";
import Button from "@/app/components/Button";
export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:4000/admin/users/${id}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (id) fetchUser(); //   Fetch user only when ID is available
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:4000/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
        body: JSON.stringify(user),
      });

      setMessage("User updated successfully!");
      setTimeout(() => router.push("/dashboard/admin/users"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-content">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
        Edit User</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      {user ? (
        <form onSubmit={handleUpdate} className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-700 text-center">Update Job</h2>
          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-medium">Full Name</label>

            <InputField
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-medium">Email</label>

            <InputField
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-gray-600 text-sm font-medium">Job Type</label>

            <SelectField
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              options={[
                { value: "employee", label: "Employee" },
                { value: "recruiter", label: "Recruiter" },
                { value: "admin", label: "Admin" },
              ]}
            />
          </div>
          <div className="flex justify-center">
            <Button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
              Update User
            </Button>
          </div>
        </form>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
}
