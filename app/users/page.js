"use client";

import React, { useEffect, useState } from "react";
import api from "../lib/axios";

// Heroicons v2 – import only what you need
import {
  UsersIcon,
  FireIcon,
  NoSymbolIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("all"); // "all" | "blocked" | "today"
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const LIMIT = 10;

  const [stats, setStats] = useState({
    total: 0,
    todayActive: 0,
    blocked: 0,
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3200);
  };

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
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers(1, currentTab);
  }, [currentTab]);

  const handleBlockToggle = async (id, currentlyBlocked) => {
    try {
      await api.patch(`/admin/users/block/${id}`);
      showToast(
        currentlyBlocked ? "✅ User unblocked" : "🚫 User blocked",
        "success"
      );
      fetchUsers(currentPage, currentTab);
      fetchStats();
    } catch (err) {
      showToast("Action failed", "error");
    }
  };

  const formatLastLogin = (date) => {
    if (!date) return "Never";
    const d = new Date(date);
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const tabs = [
    { key: "all", label: "All Users" },
    { key: "blocked", label: "Blocked" },
    { key: "today", label: "Active Today" },
  ];

  return (
    <div className="min-h-screen  dark:bg-gray-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              User Management
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              View and manage all registered users
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 mb-10">
          {[
            {
              title: "Total Users",
              value: stats.total,
              icon: UsersIcon,
              color: "indigo",
              bg: "indigo-100 dark:indigo-950/40",
              text: "indigo-700 dark:indigo-300",
            },
            {
              title: "Active Today",
              value: stats.todayActive,
              icon: FireIcon,
              color: "emerald",
              bg: "emerald-100 dark:emerald-950/40",
              text: "emerald-700 dark:emerald-300",
            },
            {
              title: "Blocked Users",
              value: stats.blocked,
              icon: NoSymbolIcon,
              color: "red",
              bg: "red-100 dark:red-950/40",
              text: "red-700 dark:red-300",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 md:p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-7 h-7 text-${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {stat.title}
                  </p>
                  <p className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white`}>
                    {stat.value.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-800 mb-6 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setCurrentTab(tab.key);
                setCurrentPage(1);
              }}
              className={`flex-shrink-0 px-6 py-3 font-medium text-sm transition-all whitespace-nowrap border-b-2 ${
                currentTab === tab.key
                  ? "border-indigo-600 text-indigo-700 dark:text-indigo-300 dark:border-indigo-500"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table / Cards Container */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin w-10 h-10 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full"></div>
              <p className="mt-5 text-gray-600 dark:text-gray-400">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-gray-500 dark:text-gray-400">
              No users found in this category
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Last Login</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <UserIcon className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {user.username}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                                <EnvelopeIcon className="w-4 h-4" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {user.phone ? (
                            <div className="flex items-center gap-1.5">
                              <PhoneIcon className="w-4 h-4" />
                              {user.phone}
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1.5">
                            <ClockIcon className="w-4 h-4" />
                            {formatLastLogin(user.lastLogin)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                              user.isBlocked
                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            }`}
                          >
                            {user.isBlocked ? (
                              <ShieldExclamationIcon className="w-4 h-4" />
                            ) : (
                              <ShieldCheckIcon className="w-4 h-4" />
                            )}
                            {user.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                            className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
                              user.isBlocked
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-red-600 hover:bg-red-700 text-white"
                            }`}
                          >
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-800">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <UserIcon className="w-6 h-6 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {user.username}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          user.isBlocked
                            ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <PhoneIcon className="w-4 h-4" />
                        {user.phone || "—"}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <ClockIcon className="w-4 h-4" />
                        {formatLastLogin(user.lastLogin)}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                        className={`w-full py-2.5 text-sm font-medium rounded-lg ${
                          user.isBlocked
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                      >
                        {user.isBlocked ? "Unblock User" : "Block User"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalUsers > 0 && (
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50">
                  <div className="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                    Showing {users.length} of {totalUsers.toLocaleString("en-IN")}{" "}
                    {currentTab === "blocked"
                      ? "blocked"
                      : currentTab === "today"
                      ? "active today"
                      : "total"}{" "}
                    users
                  </div>

                  <div className="flex justify-center sm:justify-end gap-3">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => fetchUsers(currentPage - 1)}
                      className="px-5 py-2 rounded-lg font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      ← Prev
                    </button>

                    <span className="px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => fetchUsers(currentPage + 1)}
                      className="px-5 py-2 rounded-lg font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Toast */}
        {toast.show && (
          <div
            className={`fixed bottom-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto px-5 py-4 rounded-xl shadow-2xl text-white z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 ${
              toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}