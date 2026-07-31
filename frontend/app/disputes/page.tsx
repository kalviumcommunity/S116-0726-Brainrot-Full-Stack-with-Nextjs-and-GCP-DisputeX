"use client";

import AppShell from "@/components/common/AppShell";
import { Search, SlidersHorizontal, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { disputeService, Dispute } from "@/services/dispute.service";

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'WON') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        Won
      </div>
    );
  }
  if (status === 'OPEN' || status === 'UNDER_REVIEW') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
        {status === 'OPEN' ? 'Open' : 'Under Review'}
      </div>
    );
  }
  if (status === 'LOST') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground text-xs font-medium">
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></div>
        Lost
      </div>
    );
  }
  return null;
};

export default function DisputesPage() {
  const router = useRouter();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const filters = ["All", "OPEN", "UNDER_REVIEW", "WON", "LOST"];

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
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredDisputes = disputes.filter((dispute) => {
    if (activeFilter !== "All" && dispute.status !== activeFilter) return false;
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const matchesSearch = 
        dispute.id.toLowerCase().includes(lowerQuery) ||
        dispute.reason.toLowerCase().includes(lowerQuery);
      if (!matchesSearch) return false;
    }

    return true;
  });

  const sortedDisputes = [...filteredDisputes].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    
    if (key === "amount") {
      return direction === "asc" ? a.amount - b.amount : b.amount - a.amount;
    }
    
    if (key === "created") {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    return 0;
  });

  return (
    <AppShell>
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full font-sans p-2">
        {/* Header Section */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-1 uppercase">Disputes</p>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">All disputes</h1>
          <p className="text-sm text-muted-foreground mt-1">{filteredDisputes.length} shown</p>
        </div>

        {/* Toolbar Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-1/2 md:w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center bg-card border border-border rounded-lg p-1 overflow-x-auto w-full sm:w-auto text-sm">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors border-r border-border pr-3">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <div className="flex gap-1 pl-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                    activeFilter === filter
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {filter === "All" ? "All" : filter.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-card">
                  <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dispute ID</th>
                  <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reason</th>
                  <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div onClick={() => handleSort('amount')} className="flex items-center gap-1 cursor-pointer hover:text-foreground select-none">
                      Amount <span className="text-[10px]">{sortConfig?.key === 'amount' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↑↓'}</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div onClick={() => handleSort('created')} className="flex items-center gap-1 cursor-pointer hover:text-foreground select-none">
                      Created <span className="text-[10px]">{sortConfig?.key === 'created' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↑↓'}</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 px-6 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </td>
                  </tr>
                ) : sortedDisputes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 px-6 text-center text-muted-foreground">
                      No disputes found
                    </td>
                  </tr>
                ) : (
                  sortedDisputes.map((dispute) => (
                    <tr key={dispute.id} className="hover:bg-muted/40 transition-colors group">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-semibold text-sm text-foreground">{dispute.id.slice(0, 14)}...</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-muted-foreground line-clamp-1 max-w-[250px]">{dispute.reason}</div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-sm font-semibold text-foreground">{dispute.currency} {dispute.amount.toFixed(2)}</div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-sm text-muted-foreground">{new Date(dispute.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <StatusBadge status={dispute.status} />
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <button
                          onClick={() => router.push(`/disputes/${dispute.id}`)}
                          className="px-4 py-1.5 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors rounded-lg font-medium text-sm"
                        >
                          View
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
    </AppShell>
  );
}
