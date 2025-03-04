"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/app/globals.css";
require('dotenv').config();
export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const hideSidebar = pathname === "/login" || pathname === "/register" || pathname === "/dashboard";
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);

    //   Redirect admin to admin dashboard
    if (role === "admin" && !pathname.startsWith("/dashboard/admin")) {
      router.push("/dashboard/admin");
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");

      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <html lang="en">
      <body>
        {!hideSidebar && (
          <aside className="sidebar">
            <h2>Dashboard</h2>
            <ul>
              {userRole === "admin" ? (
                <>
                  <li onClick={() => router.push("/dashboard/admin")}>Admin Home</li>
                  <li onClick={() => router.push("/dashboard/admin/users")}>Manage Users</li>
                  <li onClick={() => router.push("/dashboard/admin/jobs")}>Manage Jobs</li>
                </>
              ) : (
                <>
                  <li onClick={() => router.push("/dashboard")}>Home</li>
                  {userRole === "recruiter" && (
                    <>
                      <li onClick={() => router.push("/dashboard/jobs")}>My Jobs</li>
                      <li onClick={() => router.push("/dashboard/create-job")}>Post Job</li>
                    </>
                  )}
                  {userRole === "employee" && (
                    <li onClick={() => router.push("/dashboard/applications")}>My Applications</li>
                  )}
                  <li onClick={() => router.push("/dashboard/settings")}>Settings</li>
                </>
              )}
              <li className="logout-btn" onClick={handleLogout}>Logout</li>
            </ul>
          </aside>
        )}

        <main className={hideSidebar ? "full-width" : "with-sidebar"}>
          {children}
        </main>
      </body>
    </html>
  );
}
