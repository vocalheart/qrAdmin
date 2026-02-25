"use client";

import React, { useEffect, useState } from "react";
import api from "../lib/axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("all"); // "all" | "blocked" | "today"
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const LIMIT = 10;

  // Stats Cards
  const [stats, setStats] = useState({
    total: 0,
    todayActive: 0,
    blocked: 0,
  });

  // Toast
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // Fetch Stats for Cards
  const fetchStats = async () => {
    try {
      const [allRes, blockedRes, todayRes] = await Promise.all([
        api.get("/admin/users/all?page=1&limit=1"),
        api.get("/admin/users/blocked?page=1&limit=1"),
        api.get("/admin/users/today-active?page=1&limit=1"),
      ]);

      setStats({
        total: allRes.data.total || 0,
        blocked: blockedRes.data.total || 0,
        todayActive: todayRes.data.total || 0,
      });
    } catch (err) {
      console.error("Stats Fetch Error:", err);
    }
  };

  // Fetch Users based on Tab
  const fetchUsers = async (page = 1, tab = currentTab) => {
    try {
      setLoading(true);
      let url = "/admin/users/all";

      if (tab === "blocked") url = "/admin/users/blocked";
      if (tab === "today") url = "/admin/users/today-active";

      const res = await api.get(`${url}?page=${page}&limit=${LIMIT}`);

      setUsers(res.data.users || []);
      setTotalUsers(res.data.total || 0);
      setTotalPages(res.data.pages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch Users Error:", err);
      showToast("Failed to load users. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();        // Load stats once
    fetchUsers(1, currentTab);
  }, [currentTab]);

  // Block / Unblock User
  const handleBlockToggle = async (id, isBlocked) => {
    try {
      await api.patch(`/admin/users/block/${id}`);
      showToast(isBlocked ? "✅ User unblocked successfully" : "🚫 User blocked successfully");
      
      // Refresh everything
      fetchUsers(currentPage, currentTab);
      fetchStats();
    } catch (err) {
      showToast("Action failed", "error");
    }
  };

  // Format Last Login
  const formatLastLogin = (date) => {
    if (!date) return "Never logged in";
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) + " at " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all registered users</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Users */}
        <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl">
            👥
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-4xl font-bold text-gray-900">{stats.total.toLocaleString("en-IN")}</p>
          </div>
        </div>

        {/* Today Active */}
        <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl">
            🔥
          </div>
          <div>
            <p className="text-gray-500 text-sm">Today Active</p>
            <p className="text-4xl font-bold text-emerald-600">{stats.todayActive.toLocaleString("en-IN")}</p>
          </div>
        </div>

        {/* Blocked Users */}
        <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-3xl">
            ⛔
          </div>
          <div>
            <p className="text-gray-500 text-sm">Blocked Users</p>
            <p className="text-4xl font-bold text-red-600">{stats.blocked.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {[
          { key: "all", label: "All Users" },
          { key: "blocked", label: "Blocked Users" },
          { key: "today", label: "Today Active" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setCurrentTab(tab.key);
              setCurrentPage(1);
            }}
            className={`px-8 py-4 font-medium text-sm transition-all border-b-2 ${
              currentTab === tab.key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-5 text-left font-semibold text-gray-700">Username</th>
                  <th className="p-5 text-left font-semibold text-gray-700">Email</th>
                  <th className="p-5 text-left font-semibold text-gray-700">Phone</th>
                  <th className="p-5 text-left font-semibold text-gray-700">Last Login</th>
                  <th className="p-5 text-left font-semibold text-gray-700">Status</th>
                  <th className="p-5 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5 font-medium text-gray-900">{user.username}</td>
                    <td className="p-5 text-gray-600">{user.email}</td>
                    <td className="p-5 text-gray-600">{user.phone || "—"}</td>
                    <td className="p-5 text-gray-600 text-sm">
                      {formatLastLogin(user.lastLogin)}
                    </td>
                    <td className="p-5">
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                          user.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="p-5">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                          className={`px-6 py-2 text-sm font-medium rounded-xl transition-all ${
                            user.isBlocked
                              ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          }`}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-20 text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalUsers > 0 && (
              <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
                <button
                  disabled={currentPage === 1}
                  onClick={() => fetchUsers(currentPage - 1)}
                  className={`px-6 py-2 rounded-xl font-medium transition-all ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  ← Previous
                </button>

                <span className="text-gray-700 font-medium">
                  Page <span className="font-semibold">{currentPage}</span> of {totalPages} 
                  ({totalUsers} {currentTab === "blocked" ? "blocked" : currentTab === "today" ? "active today" : "total"} users)
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => fetchUsers(currentPage + 1)}
                  className={`px-6 py-2 rounded-xl font-medium transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[60] text-white transition-all duration-300 ${
            toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}