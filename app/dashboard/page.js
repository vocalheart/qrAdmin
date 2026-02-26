"use client";

import React, { useEffect, useState } from "react";
import api from "../lib/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState({ payments: [], newUsers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, activityRes] = await Promise.all([
          api.get("/admin/dashboard/stats"),
          api.get("/admin/dashboard/recent-activity"),
        ]);

        setStats(statsRes.data.stats);
        setRecent(activityRes.data.recent || { payments: [], newUsers: [] });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-14 h-14 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full mb-5"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
            Platform overview • {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-10 md:mb-12">
          {[
            {
              title: "Total Users",
              value: stats?.users?.total?.toLocaleString() || "0",
              iconColor: "blue",
              sub: [
                { label: "Active today", value: stats?.users?.activeToday || 0, color: "green" },
                { label: "Blocked", value: stats?.users?.blocked || 0, color: "red" },
              ],
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              ),
            },
            {
              title: "Administrators",
              value: stats?.admins?.total || "0",
              iconColor: "purple",
              sub: [
                { label: "Active", value: stats?.admins?.active || 0, color: "green" },
              ],
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              ),
            },
            {
              title: "Total Revenue",
              value: `₹${((stats?.payments?.revenue || 0) / 100).toLocaleString("en-IN")}`,
              iconColor: "green",
              valueColor: "green",
              sub: [{ label: "Transactions", value: stats?.payments?.total || 0 }],
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ),
            },
            {
              title: "Active Plans",
              value: stats?.payments?.activeSubscriptions || "0",
              iconColor: "indigo",
              valueColor: "indigo",
              sub: [{ label: "Failed", value: stats?.payments?.failed || 0, color: "red" }],
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              ),
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 dark:border-gray-800/60 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.title}</h3>
                <div className={`w-12 h-12 bg-${item.iconColor}-100 dark:bg-${item.iconColor}-950/40 rounded-xl flex items-center justify-center`}>
                  <svg className={`w-7 h-7 text-${item.iconColor}-600 dark:text-${item.iconColor}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
              </div>

              <p className={`text-4xl font-bold ${item.valueColor ? `text-${item.valueColor}-600 dark:text-${item.valueColor}-400` : "text-gray-900 dark:text-white"}`}>
                {item.value}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {item.sub.map((s, j) => (
                  <div key={j} className="flex items-center gap-1.5">
                    <span className={`font-medium text-${s.color || "gray"}-600 dark:text-${s.color || "gray"}-400`}>
                      {s.label}:
                    </span>
                    <span className="font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {[
            {
              title: "Recent Payments",
              data: recent.payments,
              empty: "No recent payments found",
              renderItem: (p) => (
                <>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                        {p.userId?.username || p.userId?.email?.split("@")[0] || "User"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {p.userId?.email || "—"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        ₹{((p.amount || 0) / 100).toLocaleString("en-IN")}
                      </p>
                      <time className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                        {new Date(p.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </time>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span
                      className={`inline-flex px-3.5 py-1 text-xs font-semibold rounded-full tracking-wide uppercase ${
                        (p.status === "active" || p.status === "paid")
                          ? "bg-green-100 text-green-800 dark:bg-green-800/40 dark:text-green-200"
                          : p.status === "failed"
                          ? "bg-red-100 text-red-800 dark:bg-red-800/40 dark:text-red-200"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-800/40 dark:text-amber-200"
                      }`}
                    >
                      {p.status || "unknown"}
                    </span>
                  </div>
                </>
              ),
            },
            {
              title: "New Registrations",
              data: recent.newUsers,
              empty: "No new users recently",
              renderItem: (u) => (
                <div className="flex justify-between items-center gap-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                      {u.username || "New User"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{u.email}</p>
                  </div>
                  <time className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </time>
                </div>
              ),
            },
          ].map((section, idx) => (
            <div
              key={idx}
              className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60 dark:border-gray-800/60 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="px-6 py-5 border-b border-gray-200/80 dark:border-gray-800/60">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{section.title}</h2>
              </div>

              <div className="divide-y divide-gray-200/80 dark:divide-gray-800/60 max-h-[480px] overflow-y-auto overscroll-contain">
                {section.data?.length > 0 ? (
                  section.data.map((item) => (
                    <div
                      key={item._id}
                      className="p-6 hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors duration-200"
                    >
                      {section.renderItem(item)}
                    </div>
                  ))
                ) : (
                  <div className="py-16 px-6 text-center text-gray-500 dark:text-gray-400 italic">
                    {section.empty}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}