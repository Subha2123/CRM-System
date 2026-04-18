"use client";

import { useEffect, useState } from "react";

// services/user.service.js
async function fetchUsers() {
  const res = await fetch("/api/users");
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data;
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-lg">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {error && (
        <p className="text-red-500 mb-4">{error}</p>
      )}

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role || "User"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
