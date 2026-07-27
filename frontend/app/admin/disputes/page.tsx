"use client";
import AdminAppShell from "@/components/common/AdminAppShell";
import { Search, ChevronDown, Eye, Clock, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DUMMY_DISPUTES = [
  { id: "DSP_CC96E8D0A417", merchant: "Aditya Patel", transaction: "pay_YTERM3G2QH", amount: "₹36,229.20", created: "09 Jul 2026", deadline: "Expired", status: "Pending", priority: "NORMAL" },
  { id: "DSP_7141990BC6A7", merchant: "Aditya Patel", transaction: "pay_7X5IB8QTAR", amount: "₹28,204.71", created: "09 Jul 2026", deadline: "Expired", status: "Pending", priority: "NORMAL" },
  { id: "DSP_4FB14A1BF136", merchant: "Kabir Mehta", transaction: "pay_Y9GEB7VCWE", amount: "₹27,163.35", created: "09 Jul 2026", deadline: "Expired", status: "Pending", priority: "NORMAL" },
  { id: "DSP_BB22DF6410E5", merchant: "Rohan Verma", transaction: "pay_WA929YAXHC", amount: "₹8,794.68", created: "08 Jul 2026", deadline: "Expired", status: "Pending", priority: "NORMAL" },
  { id: "DSP_B3DAC27C2E2F", merchant: "Neha Gupta", transaction: "pay_FQPTHDQQRS", amount: "₹13,178.52", created: "08 Jul 2026", deadline: "Expired", status: "Responded", priority: "NORMAL" },
  { id: "DSP_11270BDCE521", merchant: "Meera Nair", transaction: "pay_4OBL9BVS3T", amount: "₹38,860.17", created: "08 Jul 2026", deadline: "Expired", status: "Pending", priority: "NORMAL" },
  { id: "DSP_BBC5DFE7DC2C", merchant: "Sana Khan", transaction: "pay_AB306CGXT4", amount: "₹15,224.34", created: "08 Jul 2026", deadline: "Expired", status: "Pending", priority: "NORMAL" },
  { id: "DSP_8548F5756E65", merchant: "Ananya Sharma", transaction: "pay_55PTQL0U0I", amount: "₹35,639.42", created: "08 Jul 2026", deadline: "Expired", status: "Won", priority: "NORMAL" },
  { id: "DSP_005665E7D944", merchant: "Sana Khan", transaction: "pay_RAPSXY1RXF", amount: "₹21,267.26", created: "08 Jul 2026", deadline: "Expired", status: "Pending", priority: "NORMAL" },
];

export default function AdminDisputesPage() {
  const router = useRouter();
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All statuses");
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("All priorities");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const statuses = ["All statuses", "Open", "Submitted", "Escalated", "Won", "Lost"];
  const priorities = ["All priorities", "Low", "Normal", "High", "Urgent"];

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const filteredDisputes = DUMMY_DISPUTES.filter((d) => {
    if (selectedStatus !== "All statuses" && d.status !== selectedStatus) return false;
    if (selectedPriority !== "All priorities" && d.priority.toLowerCase() !== selectedPriority.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!d.id.toLowerCase().includes(q) && !d.transaction.toLowerCase().includes(q) && !d.merchant.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const sortedDisputes = [...filteredDisputes].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (key === "id" || key === "transaction" || key === "merchant") {
      return direction === "asc" ? a[key as keyof typeof a].localeCompare(b[key as keyof typeof b]) : b[key as keyof typeof b].localeCompare(a[key as keyof typeof a]);
    }
    if (key === "amount") {
      const aA = parseFloat(a.amount.replace(/[^0-9.-]+/g, ""));
      const bA = parseFloat(b.amount.replace(/[^0-9.-]+/g, ""));
      return direction === "asc" ? aA - bA : bA - aA;
    }
    return 0;
  });

  const getStatusBadge = (status: string) => {
    if (status === "Pending") return "bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300";
    if (status === "Responded") return "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300";
    if (status === "Won") return "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300";
    return "bg-muted text-muted-foreground";
  };

  const getStatusDot = (status: string) => {
    if (status === "Pending") return "bg-orange-400";
    if (status === "Responded") return "bg-blue-400";
    if (status === "Won") return "bg-green-400";
    return "bg-muted-foreground";
  };

  return (
    <AdminAppShell>
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-8">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            <span className="text-red-500">ADMIN</span> <span className="mx-2">·</span> DISPUTES
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-1">All Disputes</h1>
          <p className="text-muted-foreground">{filteredDisputes.length} of {DUMMY_DISPUTES.length} disputes</p>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border">
          <div className="p-4 border-b border-border flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px] relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search by ref, transaction, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                className="inline-flex justify-between items-center w-[160px] px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted transition-colors"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                {selectedStatus}
                <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
              </button>
              {isStatusDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-[160px] rounded-md shadow-lg bg-card border border-border z-10">
                  <div className="py-1">
                    {statuses.map((status) => (
                      <button key={status} className={`block px-4 py-2 text-sm text-left w-full transition-colors ${selectedStatus === status ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300' : 'text-foreground hover:bg-muted'}`} onClick={() => { setSelectedStatus(status); setIsStatusDropdownOpen(false); }}>
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                className="inline-flex justify-between items-center w-[140px] px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted transition-colors"
                onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
              >
                {selectedPriority}
                <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
              </button>
              {isPriorityDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-[140px] rounded-md shadow-lg bg-card border border-border z-10">
                  <div className="py-1">
                    {priorities.map((priority) => (
                      <button key={priority} className={`block px-4 py-2 text-sm text-left w-full transition-colors ${selectedPriority === priority ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300' : 'text-foreground hover:bg-muted'}`} onClick={() => { setSelectedPriority(priority); setIsPriorityDropdownOpen(false); }}>
                        <div className="flex items-center justify-between">
                          <span>{priority}</span>
                          {selectedPriority === priority && <Check className="h-4 w-4" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  {["id", "merchant", "transaction"].map((col) => (
                    <th key={col} scope="col" onClick={() => handleSort(col)} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 select-none">
                      {col.charAt(0).toUpperCase() + col.slice(1)} {sortConfig?.key === col ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↑↓'}
                    </th>
                  ))}
                  <th scope="col" onClick={() => handleSort('amount')} className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 select-none">
                    Amount {sortConfig?.key === 'amount' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↑↓'}
                  </th>
                  <th scope="col" onClick={() => handleSort('created')} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 select-none">
                    Created {sortConfig?.key === 'created' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↑↓'}
                  </th>
                  {["Deadline", "Status", "Priority", "Actions"].map((h) => (
                    <th key={h} scope="col" className={`px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider ${h === 'Actions' ? 'text-center' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {sortedDisputes.map((dispute) => (
                  <tr key={dispute.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{dispute.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{dispute.merchant}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{dispute.transaction}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground text-right font-medium">{dispute.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{dispute.created}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center text-red-500 font-medium text-xs bg-red-50 dark:bg-red-950 px-2 py-1 rounded-full w-fit">
                        <Clock className="w-3 h-3 mr-1" />{dispute.deadline}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(dispute.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(dispute.status)}`}></span>
                        {dispute.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">{dispute.priority}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button onClick={() => router.push(`/admin/disputes/${dispute.id}`)} className="text-muted-foreground hover:text-foreground transition-colors">
                        <Eye className="h-5 w-5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminAppShell>
  );
}
