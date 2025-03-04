"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/app/components/InputField";
import SelectField from "@/app/components/SelectField";
import Button from "@/app/components/Button";
import '@/app/globals.css';
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:4000/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      //   Store user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);

      //   Redirect Admins to `/dashboard/admin`
      if (data.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 relative">
      {/* Background Tilted Card */}
      <div className="absolute w-full max-w-md h-[450px] bg-gradient-to-r from-blue-300 to-blue-700 rounded-lg rotate-3 shadow-xltransform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl "></div>
      {/* Foreground White Card */}
      <div className="relative w-full  h-[400px] max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Login
        </h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Login</Button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?
          <Button className="link-btn" onClick={() => router.push("/register")}>
            Register here
          </Button>
        </p>
      </div>
    </div>
  );
}
