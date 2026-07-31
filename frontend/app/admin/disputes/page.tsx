"use client";
import AdminAppShell from "@/components/common/AdminAppShell";
import { Search, ChevronDown, Eye, Clock, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { disputeService, Dispute } from "@/services/dispute.service";

export default function AdminDisputesPage() {
  const router = useRouter();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All statuses");
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("All priorities");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const statuses = ["All statuses", "OPEN", "UNDER_REVIEW", "WON", "LOST"];
  const priorities = ["All priorities", "Low", "Normal", "High", "Urgent"];

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const response = await disputeService.getDisputes();
        setDisputes(response.disputes || []);
      } catch (error) {
        console.error("Failed to fetch disputes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDisputes();
  }, []);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const filteredDisputes = disputes.filter((d) => {
    if (selectedStatus !== "All statuses" && d.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!d.id.toLowerCase().includes(q) && !(d.merchant?.name || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const sortedDisputes = [...filteredDisputes].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (key === "id") {
      return direction === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
    }
    if (key === "merchant") {
      const m1 = a.merchant?.name || "";
      const m2 = b.merchant?.name || "";
      return direction === "asc" ? m1.localeCompare(m2) : m2.localeCompare(m1);
    }
    if (key === "amount") {
      return direction === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }
    if (key === "created") {
      return direction === "asc" ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const getStatusBadge = (status: string) => {
    if (status === "OPEN" || status === "UNDER_REVIEW") return "bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300";
    if (status === "WON") return "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300";
    return "bg-muted text-muted-foreground"; // LOST
  };

  const getStatusDot = (status: string) => {
    if (status === "OPEN" || status === "UNDER_REVIEW") return "bg-orange-400";
    if (status === "WON") return "bg-green-400";
    return "bg-muted-foreground"; // LOST
  };

  return (
    <AdminAppShell>
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-8">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            <span className="text-red-500">ADMIN</span> <span className="mx-2">·</span> DISPUTES
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-1">All Disputes</h1>
          <p className="text-muted-foreground">{filteredDisputes.length} disputes</p>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border">
          <div className="p-4 border-b border-border flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px] relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search by ref, merchant..."
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
                  {["id", "merchant"].map((col) => (
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
                  {["Status", "Actions"].map((h) => (
                    <th key={h} scope="col" className={`px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider ${h === 'Actions' ? 'text-center' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : sortedDisputes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No disputes found
                    </td>
                  </tr>
                ) : (
                  sortedDisputes.map((dispute) => (
                    <tr key={dispute.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{dispute.id.slice(0, 14)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{dispute.merchant?.name || "Unknown"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground text-right font-medium">{dispute.currency} {dispute.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{new Date(dispute.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(dispute.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(dispute.status)}`}></span>
                          {dispute.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button onClick={() => router.push(`/admin/disputes/${dispute.id}`)} className="text-muted-foreground hover:text-foreground transition-colors">
                          <Eye className="h-5 w-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminAppShell>
  );
}
