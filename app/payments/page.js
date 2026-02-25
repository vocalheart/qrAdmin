"use client";

import React, { useEffect, useState } from "react";
import api from "../lib/axios";

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const LIMIT = 10;

  // Stats
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    failedPayments: 0,
  });

  // Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/payments/stats");
      setStats({
        totalPayments: res.data.stats.totalPayments,
        totalRevenue: res.data.stats.totalRevenue / 100,
        activeSubscriptions: res.data.stats.activeSubscriptions,
        failedPayments: res.data.stats.failedPayments,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Payments
  const fetchPayments = async (page = 1, tab = currentTab) => {
    try {
      setLoading(true);
      let url = "/admin/payments/all";

      if (tab === "orders") url = "/admin/payments/orders";
      if (tab === "subscriptions") url = "/admin/payments/subscriptions";
      if (tab === "active") url = "/admin/payments/active";
      if (tab === "failed") url = "/admin/payments/failed";

      const res = await api.get(`${url}?page=${page}&limit=${LIMIT}`);

      setPayments(res.data.payments || []);
      setTotalItems(res.data.total || 0);
      setTotalPages(res.data.pages || 1);
      setCurrentPage(page);
    } catch (err) {
      showToast("Failed to load payments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPayments(1, currentTab);
  }, [currentTab]);

  // Format Amount
  const formatAmount = (paise) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  // Format Date
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-1">All transactions & subscriptions</p>
        </div>
      </div>

      {/* Stats Cards with SVG Icons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-1a2 2 0 01-2-2H9a2 2 0 01-2-2v-1a2 2 0 012-2m0 0V9a2 2 0 012-2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-3xl font-bold text-indigo-600">₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* Total Payments */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Payments</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.totalPayments}</p>
            </div>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Subscriptions</p>
              <p className="text-3xl font-bold text-purple-600">{stats.activeSubscriptions}</p>
            </div>
          </div>
        </div>

        {/* Failed Payments */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 01-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Failed Payments</p>
              <p className="text-3xl font-bold text-red-600">{stats.failedPayments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {[
          { key: "all", label: "All Payments" },
          { key: "orders", label: "One-time Orders" },
          { key: "subscriptions", label: "Subscriptions" },
          { key: "active", label: "Active Subs" },
          { key: "failed", label: "Failed" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setCurrentTab(tab.key); setCurrentPage(1); }}
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

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payments...</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-5 text-left">User</th>
                  <th className="p-5 text-left">Type</th>
                  <th className="p-5 text-left">Amount</th>
                  <th className="p-5 text-left">Status</th>
                  <th className="p-5 text-left">Date</th>
                  <th className="p-5 text-left">Order / Sub ID</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="p-5">
                      <div>
                        <p className="font-medium">{p.userId?.username || "—"}</p>
                        <p className="text-sm text-gray-500">{p.userId?.email}</p>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        p.type === "order" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                      }`}>
                        {p.type === "order" ? "One-time" : "Subscription"}
                      </span>
                    </td>
                    <td className="p-5 font-semibold">{formatAmount(p.amount)}</td>
                    <td className="p-5">
                      <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                        p.status === "paid" || p.status === "active" ? "bg-emerald-100 text-emerald-700" :
                        p.status === "failed" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-5 text-sm text-gray-600">{formatDate(p.createdAt)}</td>
                    <td className="p-5 text-sm font-mono text-gray-500">
                      {p.type === "order" ? p.orderId || p.paymentId : p.subscriptionId || "—"}
                    </td>
                  </tr>
                ))}

                {payments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-20 text-gray-500">No payments found</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalItems > 0 && (
              <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
                <button
                  disabled={currentPage === 1}
                  onClick={() => fetchPayments(currentPage - 1)}
                  className={`px-6 py-2 rounded-xl font-medium ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                >
                  ← Previous
                </button>
                <span className="text-gray-700 font-medium">
                  Page {currentPage} of {totalPages} ({totalItems} payments)
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => fetchPayments(currentPage + 1)}
                  className={`px-6 py-2 rounded-xl font-medium ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-2xl shadow-2xl text-white z-[60] ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}