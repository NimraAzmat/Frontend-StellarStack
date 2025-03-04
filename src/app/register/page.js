"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/app/components/InputField";
import SelectField from "@/app/components/SelectField";
import Button from "@/app/components/Button";

import '@/app/globals.css';
export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`http://localhost:4000/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 relative">
      {/* Background Tilted Card */}
      <div className="absolute w-full max-w-md h-[450px] bg-gradient-to-r from-blue-300 to-blue-700 rounded-lg rotate-3 shadow-xltransform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl "></div>
      {/* Foreground White Card */}
      <div className="relative w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Register
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <InputField
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <SelectField
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: "employee", label: "Employee" },
              { value: "recruiter", label: "Recruiter" },
              { value: "admin", label: "Admin" },
            ]}
          />
          <Button type="submit">Register</Button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?
          <button
            className="text-blue-600 hover:underline"
            onClick={() => router.push("/login")}
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
