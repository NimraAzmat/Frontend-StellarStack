"use client";

import { useRouter } from "next/navigation";

import Button from "../../components/Button";

import '../../globals.css';
export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="dashboard-content flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Admin Dashboard</h2>
      <Button onClick={() => router.push("/dashboard/admin/users")}>Manage Users</Button>
      <Button onClick={() => router.push("/dashboard/admin/jobs")}>Manage Jobs</Button>
    </div>
  );
}
