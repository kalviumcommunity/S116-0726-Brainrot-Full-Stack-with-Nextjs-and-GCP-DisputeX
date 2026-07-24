"use client";

import AdminAppShell from "@/components/common/AdminAppShell";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DisputeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <AdminAppShell>
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full bg-slate-50 font-sans p-6">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/admin/disputes" className="inline-flex items-center text-sm font-medium text-slate-700 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            All disputes
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{id || "DSP_6905EB13978F"}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                  Lost
                </span>
              </div>
              <p className="text-slate-600 text-sm">
                Chargeback filed by <span className="font-semibold text-slate-900">Arjun Rao</span> via <span className="font-semibold text-slate-900">HDFC Bank</span>
              </p>
            </div>
            
            <div className="text-left md:text-right">
              <h2 className="text-3xl font-bold text-slate-900">₹45,085.51</h2>
              <p className="text-slate-500 text-sm mt-1">Reason: product unacceptable</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mt-8">
            <div>
              <p className="text-xs font-semibold text-slate-500 tracking-wider mb-2 uppercase">Deadline</p>
              <div className="inline-flex items-center px-3 py-1 rounded-md bg-red-50 text-red-600 text-sm font-medium mb-1">
                Deadline passed
              </div>
              <p className="text-xs text-slate-500">Due 10 Jul 2026, 06:18 am</p>
            </div>
            
            <button className="inline-flex items-center gap-2 bg-[#9b87f5] hover:bg-[#8a74f2] text-white px-6 py-2.5 rounded-lg font-medium transition-colors cursor-not-allowed opacity-90">
              <Send className="h-4 w-4" />
              Response submitted
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
          <div className="flex flex-wrap border-b border-slate-100 p-1 gap-1">
            <button className="flex-1 min-w-[120px] py-2.5 text-sm font-semibold bg-white rounded-lg shadow-sm border border-slate-200 text-slate-900">
              Evidence
            </button>
            <button className="flex-1 min-w-[120px] py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
              Timeline
            </button>
            <button className="flex-1 min-w-[120px] py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
              Transaction
            </button>
            <button className="flex-1 min-w-[120px] py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
              Merchant
            </button>
          </div>
        </div>

        {/* Evidence Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[200px]">
            <h3 className="font-bold text-slate-900 mb-2">Upload new evidence</h3>
            <p className="text-sm text-slate-500">
              Uploads are immutable once saved. A cryptographic hash is generated for each file.
            </p>
          </div>

          {/* History Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[200px] flex flex-col">
            <h3 className="font-bold text-slate-900 mb-1">Immutable evidence history</h3>
            <p className="text-sm text-slate-500 mb-8">0 file(s) attached</p>
            
            <div className="flex-1 flex items-center justify-center text-sm text-slate-400 pb-8">
              No evidence uploaded yet.
            </div>
          </div>
        </div>
      </div>
    </AdminAppShell>
  );
}
