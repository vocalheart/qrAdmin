"use client";

import React, { useEffect, useState } from "react";
import api from "../lib/axios";

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const LIMIT = 10;
  // Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  //ejkjeje
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3200);
  };
  const fetchAdmins = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/all?page=${page}&limit=${LIMIT}`);
      setAdmins(res.data.admins || []);
      setTotalAdmins(res.data.total || 0);
      setTotalPages(res.data.pages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || "Failed to load admins", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(1);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateAdmin = async () => {
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      showToast("Please fill all fields correctly (password ≥ 6 chars)", "error");
      return;
    }

    try {
      setCreating(true);
      await api.post("/admin/create", form);
      showToast("Admin created successfully!", "success");
      setShowDialog(false);
      setForm({ name: "", email: "", password: "", role: "admin" });
      fetchAdmins(1);
    } catch (err) {
      showToast(err?.response?.data?.message || "Creation failed", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this admin permanently?")) return;
    try {
      await api.delete(`/admin/${id}`);
      showToast("Admin deleted", "success");
      fetchAdmins(currentPage);
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  const handleBlockToggle = async (id, currentlyActive) => {
    try {
      await api.patch(`/admin/block/${id}`);
      showToast(currentlyActive ? "Admin blocked" : "Admin unblocked", "success");
      fetchAdmins(currentPage);
    } catch (err) {
      showToast("Action failed", "error");
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-950 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Admin Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Manage system administrators and superadmins
          </p>
        </div>

        <button
          onClick={() => setShowDialog(true)}
          className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800
                     text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-medium
                     flex items-center justify-center gap-2 transition-all
                     shadow-sm hover:shadow-md active:scale-[0.98] w-full sm:w-auto"
        >
          <span className="text-lg">+</span> Add Admin
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-5 text-gray-600 dark:text-gray-400">Loading admins...</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            No administrators found
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-100/80 dark:bg-gray-800/50 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {admins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{admin.name}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{admin.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            admin.role === "superadmin"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          }`}
                        >
                          {admin.role === "superadmin" ? "Super Admin" : "Admin"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            admin.isActive
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                          }`}
                        >
                          {admin.isActive ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3 flex-wrap">
                          <button
                            onClick={() => handleBlockToggle(admin._id, admin.isActive)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                              admin.isActive
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }`}
                          >
                            {admin.isActive ? "Block" : "Unblock"}
                          </button>
                          <button
                            onClick={() => handleDelete(admin._id)}
                            className="px-4 py-1.5 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-800">
              {admins.map((admin) => (
                <div key={admin._id} className="p-5 space-y-3 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{admin.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{admin.email}</div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        admin.isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                    >
                      {admin.isActive ? "Active" : "Blocked"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Role:</span>
                    <span
                      className={`font-medium ${
                        admin.role === "superadmin" ? "text-purple-700 dark:text-purple-300" : "text-blue-700 dark:text-blue-300"
                      }`}
                    >
                      {admin.role === "superadmin" ? "Super Admin" : "Admin"}
                    </span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleBlockToggle(admin._id, admin.isActive)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                        admin.isActive
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                    >
                      {admin.isActive ? "Block" : "Unblock"}
                    </button>
                    <button
                      onClick={() => handleDelete(admin._id)}
                      className="flex-1 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalAdmins > 0 && (
              <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/50">
                <div className="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                  Showing <span className="font-medium">{admins.length}</span> of{" "}
                  <span className="font-medium">{totalAdmins}</span> admins
                </div>

                <div className="flex justify-center sm:justify-end gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => fetchAdmins(currentPage - 1)}
                    className="px-5 py-2 rounded-lg font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700
                               disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    ← Prev
                  </button>

                  <span className="px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => fetchAdmins(currentPage + 1)}
                    className="px-5 py-2 rounded-lg font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700
                               disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── CREATE MODAL ──────────────────────────────────────── */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Create New Admin
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 sm:px-8 py-5 flex flex-col sm:flex-row justify-end gap-3 border-t dark:border-gray-700">
              <button
                onClick={() => setShowDialog(false)}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAdmin}
                disabled={creating}
                className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400
                           disabled:cursor-not-allowed px-8 py-3 text-white font-medium rounded-xl
                           transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {creating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    Creating...
                  </>
                ) : (
                  "Create Admin"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed bottom-4 sm:top-6 sm:right-6 left-4 right-4 sm:left-auto sm:bottom-auto
                     px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 text-white animate-in fade-in slide-in-from-bottom-5
                     ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}