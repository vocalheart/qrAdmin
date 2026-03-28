"use client";

import React, { useRef, useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import api from "../lib/axios";
import {Upload,QrCode,User,Eye,X,ChevronLeft,ChevronRight} from "lucide-react";

function Page() {
  const [loading, setLoading] = useState(false);
  const [qrs, setQrs] = useState([]);
  const [activeTab, setActiveTab] = useState("my");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedQR, setSelectedQR] = useState(null);

  const canvasRef = useRef();

  // Frontend mein hi randomId + formUrl generate kar rahe hain
  const generateRandomFormData = () => {
    const randomId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const formUrl = `https://www.reviewbadhao.com/form/${randomId}`;
    return { randomId, formUrl };
  };

  const [formData, setFormData] = useState(generateRandomFormData());

  // Generate QR Code
  const handleGenerateQR = async () => {
    try {
      setLoading(true);

      const canvas = canvasRef.current?.querySelector("canvas");
      if (!canvas) {
        return alert("QR Preview not ready. Please try again.");
      }

      const image = canvas.toDataURL("image/png");

      // Frontend se randomId aur formUrl bhej rahe hain
      await api.post("/admin/upload-qr", {
        image,
        randomId: formData.randomId,
        formUrl: formData.formUrl,
      });

      alert("✅ QR Code generated and uploaded successfully!");

      // List refresh karo
      getQrs(activeTab, 1);

      // Naya random ID + URL generate karo next preview ke liye
      setFormData(generateRandomFormData());
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
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-600 text-white rounded-2xl">
            <QrCode size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">QR Generator</h1>
            <p className="text-gray-500">Create Review Form QR Codes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Panel - Generator */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <QrCode size={26} className="text-indigo-600" />
                Generate New QR Code
              </h2>

              {/* QR Preview */}
              <div className="my-10 flex justify-center">
                <div
                  ref={canvasRef}
                  className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm"
                >
                  <QRCodeCanvas
                    value={formData.formUrl}
                    size={260}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>

              {/* Display URL */}
              <div className="bg-gray-50 p-5 rounded-2xl text-center mb-8 break-all text-sm font-medium text-indigo-700">
                {formData.formUrl}
              </div>

              <button
                onClick={handleGenerateQR}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 transition-all text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3"
              >
                {loading ? "Generating & Uploading..." : "Generate & Upload QR Code"}
              </button>
            </div>
          </div>

          {/* Right Panel - QR List */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
                <button
                  onClick={() => handleTabChange("my")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === "my" ? "bg-white shadow text-indigo-600" : "text-gray-600 hover:bg-white/60"
                  }`}
                >
                  My QR Codes
                </button>
                <button
                  onClick={() => handleTabChange("all")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === "all" ? "bg-white shadow text-indigo-600" : "text-gray-600 hover:bg-white/60"
                  }`}
                >
                  All QR Codes
                </button>
              </div>
              <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            </div>

            {qrs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center">
                <QrCode size={60} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No QR codes found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                {qrs.map((qr) => (
                  <div
                    key={qr._id}
                    className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="p-6 flex justify-center bg-gray-50">
                      <img
                        src={qr.imageUrl}
                        alt="QR Code"
                        className="w-40 h-40 object-contain"
                      />
                    </div>

                    <div className="p-5">
                      <p className="text-sm text-gray-700 font-medium">
                        Form ID: {qr.randomId}
                      </p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                        <User size={16} />
                        <span>{qr.admin?.name || "Unknown"}</span>
                      </div>

                      <button
                        onClick={() => setSelectedQR(qr)}
                        className="mt-5 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-3 rounded-2xl font-medium flex items-center justify-center gap-2"
                      >
                        <Eye size={18} />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-10">
                <button
                  onClick={handlePrevious}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronLeft size={20} /> Previous
                </button>
                <div className="px-6 py-3 bg-white border border-gray-200 rounded-2xl font-medium">
                  {page} / {totalPages}
                </div>
                <button
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl disabled:opacity-50 hover:bg-gray-50"
                >
                  Next <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedQR && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b flex justify-between items-center">
              <h3 className="font-semibold text-xl">QR Code Details</h3>
              <button onClick={() => setSelectedQR(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="flex justify-center mb-8">
                <img
                  src={selectedQR.imageUrl}
                  alt="QR Code"
                  className="w-56 h-56 object-contain"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-gray-500 text-xs mb-1">FORM URL</p>
                  <a 
                    href={selectedQR.qrUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-indigo-600 break-all hover:underline font-medium"
                  >
                    {selectedQR.qrUrl}
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">CREATED BY</p>
                    <p className="font-medium">{selectedQR.admin?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">EMAIL</p>
                    <p className="font-medium text-indigo-600">{selectedQR.admin?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <a
                href={selectedQR.qrUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl text-center font-medium hover:bg-indigo-700"
              >
                Open Form
              </a>
              <button
                onClick={() => setSelectedQR(null)}
                className="flex-1 bg-gray-200 py-4 rounded-2xl font-medium hover:bg-gray-300"
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