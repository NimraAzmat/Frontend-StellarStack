"use client";

import { useEffect, useState } from "react";
import InputField from "@/app/components/InputField";
import Button from "@/app/components/Button";
import '@/app/globals.css';

export default function SettingsPage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:4000/users/me`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log(user)
      const res = await fetch(`http://localhost:4000/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        credentials: "include",
        body: JSON.stringify({ email: user.email, name: user.name, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Settings</h2>

      {/* Success & Error Messages */}
      {message && <p className="text-green-600 text-center mb-2">{message}</p>}
      {error && <p className="text-red-500 text-center mb-2">{error}</p>}

      {/* Settings Form */}
      <form onSubmit={handleUpdate} className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-700 text-center">Update Profile</h2>

        <div className="space-y-2">
          <label className="block text-gray-600 text-sm font-medium">Salary</label>
          <InputField
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-600 text-sm font-medium">Salary</label>
          <InputField
            type="email"
            value={user.email}
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-600 text-sm font-medium">Salary</label>
          <InputField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <Button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white py-2 rounded-lg">
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}
