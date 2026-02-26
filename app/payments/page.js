"use client";

import React, { useEffect, useState } from "react";
import api from "../lib/axios";

// Heroicons – install if needed: npm install @heroicons/react
import {
  CurrencyRupeeIcon,
  ReceiptPercentIcon,
  CreditCardIcon,
  XCircleIcon,
  UserIcon,
  CalendarIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const LIMIT = 10;

  const [stats, setStats] = useState({
    totalPayments: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    failedPayments: 0,
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3200);
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/payments/stats");
      setStats({
        totalPayments: res.data.stats.totalPayments || 0,
        totalRevenue: (res.data.stats.totalRevenue || 0) / 100,
        activeSubscriptions: res.data.stats.activeSubscriptions || 0,
        failedPayments: res.data.stats.failedPayments || 0,
      });
    } catch (err) {
      console.error("Stats fetch failed:", err);
    }
  };

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
      console.error(err);
      showToast("Failed to load payments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPayments(1, currentTab);
  }, [currentTab]);

  const formatAmount = (paise) => `₹${(paise / 100 || 0).toLocaleString("en-IN")}`;

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const tabs = [
    { key: "all", label: "All Payments" },
    { key: "orders", label: "One-time" },
    { key: "subscriptions", label: "Subscriptions" },
    { key: "active", label: "Active Subs" },
    { key: "failed", label: "Failed" },
  ];

  return (
    <div className="min-h-screen dark:bg-gray-950 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Payment Management
          </h1>
          <p className="mt-1.5 text-gray-600 dark:text-gray-400">
            Track transactions, subscriptions & revenue
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-10">
          {[
            {
              title: "Total Revenue",
              value: formatAmount(stats.totalRevenue * 100),
              icon: BanknotesIcon,
              color: "indigo",
            },
            {
              title: "Total Payments",
              value: stats.totalPayments.toLocaleString("en-IN"),
              icon: ReceiptPercentIcon,
              color: "emerald",
            },
            {
              title: "Active Subscriptions",
              value: stats.activeSubscriptions.toLocaleString("en-IN"),
              icon: CreditCardIcon,
              color: "purple",
            },
            {
              title: "Failed Payments",
              value: stats.failedPayments.toLocaleString("en-IN"),
              icon: XCircleIcon,
              color: "red",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 md:p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-950/40`}>
                  <stat.icon className={`w-7 h-7 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
                  <p className={`text-3xl md:text-4xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-800 mb-6 pb-1 scrollbar-thin">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setCurrentTab(tab.key);
                setCurrentPage(1);
              }}
              className={`flex-shrink-0 px-5 sm:px-7 py-3 font-medium text-sm transition-all whitespace-nowrap border-b-2 ${
                currentTab === tab.key
                  ? "border-indigo-600 text-indigo-700 dark:text-indigo-300 dark:border-indigo-500"
                  : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin w-10 h-10 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full"></div>
              <p className="mt-5 text-gray-600 dark:text-gray-400">Loading transactions...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="py-16 text-center text-gray-500 dark:text-gray-400">
              No payments found in this category
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Ref ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {payments.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <UserIcon className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {p.userId?.username || "—"}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                {p.userId?.email || "—"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              p.type === "order"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                            }`}
                          >
                            {p.type === "order" ? "One-time" : "Subscription"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                          {formatAmount(p.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                              p.status === "paid" || p.status === "active"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                : p.status === "failed"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                            }`}
                          >
                            {p.status === "paid" || p.status === "active" ? (
                              <CheckCircleIcon className="w-4 h-4" />
                            ) : p.status === "failed" ? (
                              <ExclamationTriangleIcon className="w-4 h-4" />
                            ) : (
                              <ClockIcon className="w-4 h-4" />
                            )}
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-4 h-4" />
                            {formatDate(p.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-gray-500 dark:text-gray-400">
                          {p.type === "order" ? p.orderId || p.paymentId : p.subscriptionId || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-800">
                {payments.map((p) => (
                  <div key={p._id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <UserIcon className="w-6 h-6 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {p.userId?.username || "—"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {p.userId?.email || "—"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          p.status === "paid" || p.status === "active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : p.status === "failed"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                        }`}
                      >
                        {p.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <BanknotesIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        <span className="font-semibold">{formatAmount(p.amount)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        {formatDate(p.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Type:</span>
                      <span
                        className={`font-medium ${
                          p.type === "order" ? "text-blue-600 dark:text-blue-400" : "text-purple-600 dark:text-purple-400"
                        }`}
                      >
                        {p.type === "order" ? "One-time" : "Subscription"}
                      </span>
                    </div>

                    <div className="text-sm font-mono text-gray-500 dark:text-gray-400">
                      Ref: {p.type === "order" ? p.orderId || p.paymentId : p.subscriptionId || "—"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalItems > 0 && (
                <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50">
                  <div className="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                    Showing {payments.length} of {totalItems.toLocaleString("en-IN")} payments
                  </div>

                  <div className="flex justify-center sm:justify-end gap-3">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => fetchPayments(currentPage - 1)}
                      className="px-5 py-2 rounded-lg font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      ← Prev
                    </button>

                    <span className="px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => fetchPayments(currentPage + 1)}
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