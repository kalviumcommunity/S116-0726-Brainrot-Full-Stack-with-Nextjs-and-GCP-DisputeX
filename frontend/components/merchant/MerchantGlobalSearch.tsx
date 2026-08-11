"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileText, CornerDownLeft, Compass } from "lucide-react";
import { disputeService, Dispute } from "@/services/dispute.service";
import { MERCHANT_MENU_ITEMS } from "@/components/layout/Sidebar";

interface SearchResultItem {
  type: 'page' | 'dispute';
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  url: string;
}

export default function MerchantGlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [disputesLoaded, setDisputesLoaded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch merchant's own disputes on search focus
  const fetchMerchantDisputes = async () => {
    if (disputesLoaded) return;
    setIsLoading(true);
    try {
      const res = await disputeService.getDisputes();
      setDisputes(res.data || []);
      setDisputesLoaded(true);
    } catch (err) {
      console.error("Failed to load merchant disputes for global search:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    fetchMerchantDisputes();
  };

  // Compute matched items for Merchant
  const flatResults = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];
    const q = query.trim().toLowerCase();

    if (!q) return items;

    // 1. Merchant Sidebar Navigation Pages Matching
    const matchedPages = MERCHANT_MENU_ITEMS.filter(
      (page) =>
        page.name.toLowerCase().includes(q) ||
        page.description.toLowerCase().includes(q) ||
        (page.keywords && page.keywords.some((k) => k.toLowerCase().includes(q)))
    );

    matchedPages.forEach((page) => {
      items.push({
        type: 'page',
        id: `nav-${page.name.toLowerCase().replace(/\s+/g, '-')}`,
        title: page.name,
        subtitle: page.description,
        badge: 'PAGE',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        url: page.href
      });
    });

    // 2. Merchant's Own Disputes Matching
    const matchedDisputes = disputes.filter((d) => {
      return (
        d.id.toLowerCase().includes(q) ||
        d.reason.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q) ||
        `${d.currency} ${d.amount}`.toLowerCase().includes(q)
      );
    });

    matchedDisputes.slice(0, 5).forEach((d) => {
      let badgeColor = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      if (d.status === 'WON') badgeColor = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      if (d.status === 'LOST') badgeColor = "bg-muted text-muted-foreground border-border";

      items.push({
        type: 'dispute',
        id: d.id,
        title: `Dispute #${d.id.substring(0, 10)}...`,
        subtitle: `${d.currency || 'USD'} ${d.amount?.toFixed(2)} · ${d.reason}`,
        badge: d.status,
        badgeColor,
        url: `/disputes/${d.id}`
      });
    });

    return items;
  }, [query, disputes]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [flatResults]);

  const handleSelect = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery("");
    router.push(item.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!isOpen || flatResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatResults[selectedIndex]) {
        handleSelect(flatResults[selectedIndex]);
      }
    }
  };

  const hasResults = flatResults.length > 0;
  const isSearching = query.trim().length > 0;

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-2xl">
      {/* Search Input Box */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search pages, disputes, or claim reasons..."
          value={query}
          onFocus={handleInputFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full h-10 pl-10 pr-16 bg-muted/60 border border-border rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
        />

        {/* Ctrl+K Shortcut Badge */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground bg-background border border-border rounded-md shadow-2xs">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Popover Dropdown Results */}
      {isOpen && isSearching && (
        <div className="absolute left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          {isLoading && !hasResults ? (
            <div className="p-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              Searching merchant portal...
            </div>
          ) : !hasResults ? (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-foreground">No results found</p>
              <p className="text-xs text-muted-foreground mt-1">No matching pages or disputes for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto p-2 divide-y divide-border/50">
              {/* Group: PAGES */}
              {flatResults.some((i) => i.type === 'page') && (
                <div className="py-2">
                  <div className="px-3 py-1 text-[11px] font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5 text-blue-500" />
                    Navigation & Pages
                  </div>
                  <div className="mt-1 space-y-1">
                    {flatResults
                      .filter((i) => i.type === 'page')
                      .map((item) => {
                        const globalIdx = flatResults.findIndex((r) => r.id === item.id && r.type === item.type);
                        const isSelected = globalIdx === selectedIndex;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                              isSelected ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-100' : 'hover:bg-muted/60 text-foreground'
                            }`}
                          >
                            <div className="min-w-0 flex-1 pr-3">
                              <div className="text-sm font-semibold truncate">{item.title}</div>
                              <div className="text-xs text-muted-foreground truncate mt-0.5">{item.subtitle}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.badge && (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                                  {item.badge}
                                </span>
                              )}
                              {isSelected && <CornerDownLeft className="h-3.5 w-3.5 text-blue-500" />}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Group: DISPUTES */}
              {flatResults.some((i) => i.type === 'dispute') && (
                <div className="py-2">
                  <div className="px-3 py-1 text-[11px] font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-blue-500" />
                    Disputes
                  </div>
                  <div className="mt-1 space-y-1">
                    {flatResults
                      .filter((i) => i.type === 'dispute')
                      .map((item) => {
                        const globalIdx = flatResults.findIndex((r) => r.id === item.id && r.type === item.type);
                        const isSelected = globalIdx === selectedIndex;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                              isSelected ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-100' : 'hover:bg-muted/60 text-foreground'
                            }`}
                          >
                            <div className="min-w-0 flex-1 pr-3">
                              <div className="text-sm font-semibold truncate">{item.title}</div>
                              <div className="text-xs text-muted-foreground truncate mt-0.5">{item.subtitle}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.badge && (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                                  {item.badge}
                                </span>
                              )}
                              {isSelected && <CornerDownLeft className="h-3.5 w-3.5 text-blue-500" />}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
