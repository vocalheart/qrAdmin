"use client";

import React, { useRef, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import api from "../lib/axios";
import {
  Upload,
  QrCode,
  User,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Page() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrs, setQrs] = useState([]);
  const [activeTab, setActiveTab] = useState("my");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedQR, setSelectedQR] = useState(null);

  const canvasRef = useRef();

  const handleUpload = async () => {
    if (!text.trim()) return alert("Please enter some text");
    try {
      setLoading(true);
      const canvas = canvasRef.current.querySelector("canvas");
      const image = canvas.toDataURL("image/png");
      await api.post("/admin/upload-qr", { image, text });
      alert("QR Code uploaded successfully! ✅");
      setText("");
      setPage(1);
      getQrs(activeTab, 1);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getQrs = async (type = "my", pageNumber = 1) => {
    try {
      const url =
        type === "my"
          ? `/admin/my-qrs?page=${pageNumber}&limit=12`
          : `/admin/all-qrs?page=${pageNumber}&limit=12`;
      const res = await api.get(url);
      setQrs(res.data.data || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setQrs([]);
    }
  };

  useEffect(() => {
    getQrs("my", 1);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    getQrs(tab, 1);
  };

  const handleNext = () => {
    if (page < totalPages) getQrs(activeTab, page + 1);
  };

  const handlePrevious = () => {
    if (page > 1) getQrs(activeTab, page - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-8">
          <div className="p-2 sm:p-3 bg-indigo-600 text-white rounded-xl sm:rounded-2xl">
            <QrCode size={22} className="sm:hidden" />
            <QrCode size={28} className="hidden sm:block md:hidden" />
            <QrCode size={32} className="hidden md:block" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
              QR Generator
            </h1>
            <p className="text-[11px] sm:text-sm text-gray-500 mt-0.5">
              Create and manage your QR codes
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">

          {/* Left Panel - Generator */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                <Upload size={18} className="text-indigo-600 sm:hidden" />
                <Upload size={20} className="text-indigo-600 hidden sm:block md:hidden" />
                <Upload size={22} className="text-indigo-600 hidden md:block" />
                Generate New QR Code
              </h2>

              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 sm:px-4 md:px-5 py-3 sm:py-3.5 md:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-indigo-500 text-[13px] sm:text-sm md:text-base"
                placeholder="Enter text or URL..."
              />

              {/* QR Preview */}
              <div className="my-5 sm:my-6 md:my-8 flex justify-center">
                <div
                  ref={canvasRef}
                  className="p-3 sm:p-4 md:p-6 bg-white border border-gray-100 rounded-2xl sm:rounded-3xl shadow-sm"
                >
                  {text ? (
                    <>
                      <div className="sm:hidden">
                        <QRCodeCanvas value={text} size={160} />
                      </div>
                      <div className="hidden sm:block md:hidden">
                        <QRCodeCanvas value={text} size={190} />
                      </div>
                      <div className="hidden md:block">
                        <QRCodeCanvas value={text} size={220} />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Mobile placeholder */}
                      <div className="w-[160px] h-[160px] sm:w-[190px] sm:h-[190px] md:w-[220px] md:h-[220px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl">
                        <div className="text-center text-gray-400">
                          <QrCode size={36} className="mx-auto mb-1.5 sm:hidden" />
                          <QrCode size={44} className="mx-auto mb-2 hidden sm:block" />
                          <p className="text-[10px] sm:text-xs">Preview will appear here</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={loading || !text.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 transition-all text-white py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl font-medium text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 sm:gap-3"
              >
                {loading ? (
                  "Uploading..."
                ) : (
                  <>
                    <Upload size={16} className="sm:hidden" />
                    <Upload size={18} className="hidden sm:block md:hidden" />
                    <Upload size={22} className="hidden md:block" />
                    Upload QR Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - QR List */}
          <div className="lg:col-span-7">
            {/* Tabs + Page info */}
            <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
              <div className="flex gap-1 sm:gap-2 bg-gray-100 p-1 rounded-xl sm:rounded-2xl">
                <button
                  onClick={() => handleTabChange("my")}
                  className={`px-3 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    activeTab === "my"
                      ? "bg-white shadow text-indigo-600"
                      : "text-gray-600 hover:bg-white/60"
                  }`}
                >
                  My QR Codes
                </button>
                <button
                  onClick={() => handleTabChange("all")}
                  className={`px-3 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    activeTab === "all"
                      ? "bg-white shadow text-indigo-600"
                      : "text-gray-600 hover:bg-white/60"
                  }`}
                >
                  All QR Codes
                </button>
              </div>

              <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>
            </div>

            {/* QR Grid */}
            {qrs.length === 0 ? (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-10 sm:p-14 md:p-16 text-center">
                <QrCode size={48} className="mx-auto text-gray-300 mb-3 sm:hidden" />
                <QrCode size={56} className="mx-auto text-gray-300 mb-4 hidden sm:block" />
                <p className="text-gray-500 text-sm sm:text-base md:text-lg">No QR codes found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {qrs.map((qr) => (
                  <div
                    key={qr._id}
                    className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-md transition-all"
                  >
                    {/* QR Image */}
                    <div className="p-3 sm:p-4 md:p-6 flex justify-center bg-gray-50">
                      <img
                        src={qr.qrUrl}
                        alt="QR Code"
                        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain"
                      />
                    </div>

                    {/* Card Body */}
                    <div className="p-3 sm:p-4 md:p-5">
                      <p className="text-[11px] sm:text-xs md:text-sm text-gray-600 line-clamp-2 min-h-[32px] sm:min-h-[36px] md:min-h-[42px]">
                        {qr.text}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2.5 sm:mt-3 md:mt-4 text-[10px] sm:text-xs text-gray-500">
                        <User size={11} className="sm:hidden" />
                        <User size={13} className="hidden sm:block md:hidden" />
                        <User size={14} className="hidden md:block" />
                        <span className="truncate">{qr.admin?.name || "Unknown"}</span>
                      </div>

                      <button
                        onClick={() => setSelectedQR(qr)}
                        className="mt-3 sm:mt-4 md:mt-5 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl font-medium flex items-center justify-center gap-1.5 sm:gap-2 transition-colors text-[11px] sm:text-xs md:text-sm"
                      >
                        <Eye size={13} className="sm:hidden" />
                        <Eye size={15} className="hidden sm:block md:hidden" />
                        <Eye size={17} className="hidden md:block" />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 mt-6 sm:mt-8 md:mt-10">
                <button
                  onClick={handlePrevious}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-white border border-gray-200 rounded-xl sm:rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition text-[11px] sm:text-xs md:text-sm"
                >
                  <ChevronLeft size={14} className="sm:hidden" />
                  <ChevronLeft size={17} className="hidden sm:block md:hidden" />
                  <ChevronLeft size={20} className="hidden md:block" />
                  Previous
                </button>

                <div className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-white border border-gray-200 rounded-xl sm:rounded-2xl font-medium text-[11px] sm:text-xs md:text-sm">
                  {page} / {totalPages}
                </div>

                <button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-white border border-gray-200 rounded-xl sm:rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition text-[11px] sm:text-xs md:text-sm"
                >
                  Next
                  <ChevronRight size={14} className="sm:hidden" />
                  <ChevronRight size={17} className="hidden sm:block md:hidden" />
                  <ChevronRight size={20} className="hidden md:block" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedQR && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-xs sm:max-w-sm md:max-w-md overflow-hidden shadow-2xl">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-4 sm:px-5 md:px-6 py-3.5 sm:py-4 md:py-5 border-b">
              <h3 className="font-semibold text-sm sm:text-base md:text-xl">QR Code Details</h3>
              <button
                onClick={() => setSelectedQR(null)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl transition"
              >
                <X size={18} className="sm:hidden" />
                <X size={22} className="hidden sm:block" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 md:p-8">
              <div className="flex justify-center mb-5 sm:mb-6 md:mb-8">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                  <img
                    src={selectedQR.qrUrl}
                    alt="QR Code"
                    className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56"
                  />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div>
                  <p className="text-gray-500 text-[10px] sm:text-xs mb-1 tracking-wide">CONTENT</p>
                  <p className="font-medium break-all text-[12px] sm:text-sm">{selectedQR.text}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <div>
                    <p className="text-gray-500 text-[10px] sm:text-xs mb-1 tracking-wide">CREATED BY</p>
                    <p className="font-medium text-[12px] sm:text-sm">{selectedQR.admin?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] sm:text-xs mb-1 tracking-wide">EMAIL</p>
                    <p className="font-medium text-indigo-600 text-[11px] sm:text-sm break-all">
                      {selectedQR.admin?.email}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 text-[10px] sm:text-xs mb-1 tracking-wide">STATUS</p>
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] sm:text-xs font-medium">
                    {selectedQR.isActive ? "● Active" : "● Inactive"}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 md:p-6 border-t bg-gray-50 flex gap-2 sm:gap-3">
              <a
                href={selectedQR.qrUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-medium text-center transition text-[12px] sm:text-sm"
              >
                Open Full Image
              </a>
              <button
                onClick={() => setSelectedQR(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-medium transition text-[12px] sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;