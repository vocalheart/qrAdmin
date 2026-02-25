"use client";

import React, { useEffect, useState } from "react";
import api from "../lib/axios";

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const LIMIT = 10;

  // Toast State
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  // Show Toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // 🔥 Fetch Admins with Pagination
  const fetchAdmins = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/all?page=${page}&limit=${LIMIT}`);

      setAdmins(res.data.admins || []);
      setTotalAdmins(res.data.total || 0);
      setTotalPages(res.data.pages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Fetch Admin Error:", err);
      showToast("Failed to load admins. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(1);
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Create Admin
  const handleCreateAdmin = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      showToast("All fields are required!", "error");
      return;
    }

    try {
      setCreating(true);
      await api.post("/admin/create", form);

      showToast("✅ Admin created successfully!");
      setShowDialog(false);
      setForm({ name: "", email: "", password: "", role: "admin" });
      fetchAdmins(1); // Go to first page after creating new admin
    } catch (err) {
      console.error(err);
      showToast(err?.response?.data?.message || "Failed to create admin", "error");
    } finally {
      setCreating(false);
    }
  };

  // 🔥 Delete Admin
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this admin?")) return;

    try {
      await api.delete(`/admin/${id}`);
      showToast("🗑️ Admin deleted successfully");
      fetchAdmins(currentPage); // Stay on current page
    } catch (err) {
      showToast(err?.response?.data?.message || "Delete failed", "error");
    }
  };

  // 🔥 Block / Unblock
  const handleBlockToggle = async (id, isActive) => {
    try {
      await api.patch(`/admin/block/${id}`);
      showToast(isActive ? "🚫 Admin blocked" : "✅ Admin unblocked");
      fetchAdmins(currentPage); // Stay on current page
    } catch (err) {
      showToast("Action failed", "error");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600 mt-1">Manage all admins & superadmins</p>
        </div>

        <button
          onClick={() => setShowDialog(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95"
        >
          <span>+</span> Create New Admin
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admins...</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-5 text-left font-semibold text-gray-700">Name</th>
                  <th className="p-5 text-left font-semibold text-gray-700">Email</th>
                  <th className="p-5 text-left font-semibold text-gray-700">Role</th>
                  <th className="p-5 text-left font-semibold text-gray-700">Status</th>
                  <th className="p-5 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {admins.map((admin) => (
                  <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5 font-medium text-gray-900">{admin.name}</td>
                    <td className="p-5 text-gray-600">{admin.email}</td>
                    <td className="p-5">
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                          admin.role === "superadmin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {admin.role === "superadmin" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td className="p-5">
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                          admin.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {admin.isActive ? "Active" : "Blocked"}
                      </span>
                    </td>

                    <td className="p-5">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleBlockToggle(admin._id, admin.isActive)}
                          className={`px-5 py-2 text-sm font-medium rounded-xl transition-all ${
                            admin.isActive
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-emerald-500 hover:bg-emerald-600 text-white"
                          }`}
                        >
                          {admin.isActive ? "Block" : "Unblock"}
                        </button>

                        <button
                          onClick={() => handleDelete(admin._id)}
                          className="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {admins.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-20 text-gray-500">
                      No admins found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalAdmins > 0 && (
              <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
                <button
                  disabled={currentPage === 1}
                  onClick={() => fetchAdmins(currentPage - 1)}
                  className={`px-6 py-2 rounded-xl font-medium transition-all ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  ← Previous
                </button>

                <span className="text-gray-700 font-medium">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  {totalPages} ({totalAdmins} total admins)
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => fetchAdmins(currentPage + 1)}
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

      {/* Create Admin Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Admin</h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password (min 6 chars)"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 px-8 py-5 flex justify-end gap-3 border-t">
              <button
                onClick={() => setShowDialog(false)}
                className="px-6 py-3 text-gray-700 hover:bg-gray-200 rounded-2xl font-medium transition"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateAdmin}
                disabled={creating}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 px-8 py-3 text-white font-medium rounded-2xl transition-all active:scale-95 flex items-center gap-2"
              >
                {creating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
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