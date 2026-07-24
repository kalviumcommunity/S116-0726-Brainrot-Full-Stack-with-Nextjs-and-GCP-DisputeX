"use client";

import AppShell from "@/components/common/AppShell";
import { Search, SlidersHorizontal, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const disputesData = [
  { id: "DSP_11E71AE1DA10", bank: "ICICI Bank", transactionId: "pay_31Y3GKX5C5", amount: "3,027.89", customerName: "Meera Nair", customerEmail: "meera.n@icloud.com", created: "03 Jul 2026", deadline: "10 Jul 2026", remaining: "Expired", status: "Won", state: "Open" },
  { id: "DSP_7ED0C9987DA9", bank: "ICICI Bank", transactionId: "pay_C6UR2B3AJF", amount: "16,636.30", customerName: "Kabir Mehta", customerEmail: "kabir.m@gmail.com", created: "03 Jul 2026", deadline: "10 Jul 2026", remaining: "Expired", status: "Pending", state: "Open" },
  { id: "DSP_FBF53EF96745", bank: "Axis Bank", transactionId: "pay_23IWE8LZU6", amount: "39,694.75", customerName: "Ananya Sharma", customerEmail: "ananya.s@gmail.com", created: "04 Jul 2026", deadline: "11 Jul 2026", remaining: "Expired", status: "Pending", state: "Open" },
  { id: "DSP_FA715D3BC86C", bank: "Yes Bank", transactionId: "pay_8J2502BGQR", amount: "33,043.38", customerName: "Arjun Rao", customerEmail: "arjun.rao@gmail.com", created: "04 Jul 2026", deadline: "11 Jul 2026", remaining: "Expired", status: "Pending", state: "Open" },
  { id: "DSP_A8F36651354D", bank: "Yes Bank", transactionId: "pay_5SIVYRDJVY", amount: "30,597.49", customerName: "Meera Nair", customerEmail: "meera.n@icloud.com", created: "05 Jul 2026", deadline: "12 Jul 2026", remaining: "Expired", status: "Lost", state: "Open" },
  { id: "DSP_9AF645D9AF94", bank: "SBI", transactionId: "pay_TN66V91KAK", amount: "6,435.05", customerName: "Aditya Patel", customerEmail: "aditya.p@gmail.com", created: "05 Jul 2026", deadline: "12 Jul 2026", remaining: "Expired", status: "Pending", state: "Open" },
  { id: "DSP_7699658C9AE4", bank: "SBI", transactionId: "pay_5WTFGVBVSL", amount: "1,418.84", customerName: "Kabir Mehta", customerEmail: "kabir.m@gmail.com", created: "05 Jul 2026", deadline: "12 Jul 2026", remaining: "Expired", status: "Lost", state: "Open" },
  { id: "DSP_D61CF71E829D", bank: "Yes Bank", transactionId: "pay_DQ06V64ZPT", amount: "15,818.15", customerName: "Aditya Patel", customerEmail: "aditya.p@gmail.com", created: "05 Jul 2026", deadline: "12 Jul 2026", remaining: "Expired", status: "Pending", state: "Open" },
  { id: "DSP_E2185643C3AC", bank: "SBI", transactionId: "pay_05SYLZDEKD", amount: "16,300.36", customerName: "Arjun Rao", customerEmail: "arjun.rao@gmail.com", created: "07 Jul 2026", deadline: "14 Jul 2026", remaining: "Expired", status: "Escalated", state: "Open" },
];

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'Won') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        Won
      </div>
    );
  }
  if (status === 'Pending') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
        Pending
      </div>
    );
  }
  if (status === 'Lost') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
        Lost
      </div>
    );
  }
  if (status === 'Escalated') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-medium">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
        Escalated
      </div>
    );
  }
  return null;
};

export default function DisputesPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const filters = ["All", "Pending", "Responded", "Escalated", "Won", "Lost"];

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredDisputes = disputesData.filter((dispute) => {
    if (activeFilter !== "All" && dispute.status !== activeFilter) return false;
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const matchesSearch = 
        dispute.id.toLowerCase().includes(lowerQuery) ||
        dispute.transactionId.toLowerCase().includes(lowerQuery) ||
        dispute.customerName.toLowerCase().includes(lowerQuery) ||
        dispute.bank.toLowerCase().includes(lowerQuery);
      if (!matchesSearch) return false;
    }

    return true;
  });

  const sortedDisputes = [...filteredDisputes].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    
    if (key === "amount") {
      const amountA = parseFloat(a.amount.replace(/,/g, ""));
      const amountB = parseFloat(b.amount.replace(/,/g, ""));
      return direction === "asc" ? amountA - amountB : amountB - amountA;
    }
    
    if (key === "created" || key === "deadline") {
      const dateA = new Date(a[key as keyof typeof a]).getTime();
      const dateB = new Date(b[key as keyof typeof b]).getTime();
      return direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    return 0;
  });

  return (
    <AppShell>
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full bg-slate-50 font-sans p-2">
        {/* Header Section */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 tracking-wider mb-1 uppercase">Disputes</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">All disputes</h1>
          <p className="text-sm text-slate-500 mt-1">{filteredDisputes.length} of {disputesData.length} shown</p>
        </div>

        {/* Toolbar Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-1/2 md:w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, transaction, customer, bank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 overflow-x-auto w-full sm:w-auto text-sm">
            <button className="p-2 text-slate-500 hover:text-slate-800 transition-colors border-r border-slate-200 pr-3">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <div className="flex gap-1 pl-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                    activeFilter === filter
                      ? "bg-slate-100 text-slate-800"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-white">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dispute</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div onClick={() => handleSort('amount')} className="flex items-center gap-1 cursor-pointer hover:text-slate-700 select-none">
                      Amount <span className="text-[10px]">{sortConfig?.key === 'amount' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↑↓'}</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div onClick={() => handleSort('created')} className="flex items-center gap-1 cursor-pointer hover:text-slate-700 select-none">
                      Created <span className="text-[10px]">{sortConfig?.key === 'created' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↑↓'}</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div onClick={() => handleSort('deadline')} className="flex items-center gap-1 cursor-pointer hover:text-slate-700 select-none">
                      Deadline <span className="text-[10px]">{sortConfig?.key === 'deadline' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↑↓'}</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Remaining</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedDisputes.map((dispute, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-semibold text-sm text-slate-900">{dispute.id}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{dispute.bank}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-sm text-slate-600 font-mono">{dispute.transactionId}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">₹{dispute.amount}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{dispute.customerName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{dispute.customerEmail}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{dispute.created}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{dispute.deadline}</div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 text-red-500 text-sm font-medium">
                        <AlertCircle className="h-4 w-4" />
                        {dispute.remaining}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <StatusBadge status={dispute.status} />
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <button
                        onClick={() => router.push(`/disputes/${dispute.id}`)}
                        className="px-4 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors rounded-lg font-medium text-sm"
                      >
                        {dispute.state}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
