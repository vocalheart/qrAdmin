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
        setRecent(activityRes.data.recent);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your platform at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Users */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Users</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-gray-900">{stats?.users.total?.toLocaleString() || 0}</p>
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Active today: {stats?.users.activeToday || 0}</span>
              <span className="text-red-600">Blocked: {stats?.users.blocked || 0}</span>
            </div>
          </div>
        </div>

        {/* Admins */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Admins</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats?.admins.total || 0}</p>
          <p className="text-sm text-gray-500 mt-1">
            Active: <span className="text-green-600 font-medium">{stats?.admins.active || 0}</span>
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">
            ₹{(stats?.payments.revenue / 100 || 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            From {stats?.payments.total || 0} transactions
          </p>
        </div>

        {/* Subscriptions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Subscriptions</h3>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{stats?.payments.activeSubscriptions || 0}</p>
          <p className="text-sm text-gray-500 mt-1">
            Failed: <span className="text-red-600">{stats?.payments.failed || 0}</span>
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Payments */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Recent Payments</h2>
          </div>
          <div className="divide-y">
            {recent.payments.length > 0 ? (
              recent.payments.map((p) => (
                <div key={p._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{p.userId?.username || "Unknown"}</p>
                      <p className="text-sm text-gray-500">{p.userId?.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹{(p.amount / 100).toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(p.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                      p.status === "active" || p.status === "paid" ? "bg-green-100 text-green-700" :
                      p.status === "failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {p.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-6 text-center text-gray-500">No recent payments</p>
            )}
          </div>
        </div>

        {/* New Users */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">New Users</h2>
          </div>
          <div className="divide-y">
            {recent.newUsers.length > 0 ? (
              recent.newUsers.map((u) => (
                <div key={u._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{u.username}</p>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-6 text-center text-gray-500">No new users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}