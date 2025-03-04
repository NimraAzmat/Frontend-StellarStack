"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/app/components/InputField";
import Table from "@/app/components/Table";
import '@/app/globals.css';
export default function ManageUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
  ];


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`http://localhost:4000/admin/users`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setIsAdmin(role === "admin");
  }, []);

  const handleDelete = async (userId) => {
    try {
      await fetch(`http://localhost:4000/admin/users/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        credentials: "include",
      });

      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  const actions = [
    {
      label: "Edit",
      className: "bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700",
      onClick: (id) => router.push(`/dashboard/admin/users/${id}/edit`),
    },
    {
      label: "Delete",
      className: "bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700",
      onClick: handleDelete,
    },
  ];
  return (
    <div className="dashboard-content">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
        Manage Users</h2>
      {error && <p className="error">{error}</p>}
      {users.length === 0 ? (
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
          No users found.</h2>
      ) : (
        <Table columns={columns} data={users.filter((user) => user.role !== "admin")} actions={actions} />

      )}
    </div>
  );
}
