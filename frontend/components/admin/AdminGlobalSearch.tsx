"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileText, Store, Activity, Bell, CornerDownLeft, Compass, LayoutDashboard, Settings } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { ADMIN_MENU_ITEMS } from "@/components/layout/AdminSidebar";

interface SearchResultItem {
  type: 'page' | 'dispute' | 'merchant' | 'activity' | 'notification';
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  url: string;
}

export default function AdminGlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<{
    disputes: any[];
    merchants: any[];
    activities: any[];
    notifications: any[];
  }>({
    disputes: [],
    merchants: [],
    activities: [],
    notifications: []
  });

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

  // Debounced API search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ disputes: [], merchants: [], activities: [], notifications: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await adminService.globalSearch(query);
        setResults(data || { disputes: [], merchants: [], activities: [], notifications: [] });
      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Flatten results for keyboard navigation (including sidebar navigation pages)
  const flatResults = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];
    const q = query.trim().toLowerCase();

    // 1. Sidebar Navigation Options Matching (Reusing ADMIN_MENU_ITEMS)
    if (q) {
      const matchedPages = ADMIN_MENU_ITEMS.filter(
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
          badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
          url: page.href
        });
      });
    }

    // 2. Disputes
    (results.disputes || []).forEach((d) => {
      let badgeColor = "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
      if (d.status === 'WON') badgeColor = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      if (d.status === 'LOST') badgeColor = "bg-muted text-muted-foreground border-border";

      items.push({
        type: 'dispute',
        id: d.id,
        title: `Dispute #${d.id.substring(0, 8)}...`,
        subtitle: `${d.merchant?.name || 'Unknown Merchant'} · ${d.currency || 'USD'} ${d.amount?.toFixed(2)} · ${d.reason}`,
        badge: d.status,
        badgeColor,
        url: `/admin/disputes/${d.id}`
      });
    });

    // 3. Merchants
    (results.merchants || []).forEach((m) => {
      items.push({
        type: 'merchant',
        id: m.id,
        title: m.name,
        subtitle: `${m.contactEmail} · ID: ${m.businessId}`,
        badge: 'MERCHANT',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        url: `/admin/merchants`
      });
    });

    // 4. Activity
    (results.activities || []).forEach((a) => {
      items.push({
        type: 'activity',
        id: a.id,
        title: a.action,
        subtitle: `${a.description} ${a.dispute ? `(#${a.dispute.id.substring(0, 8)}...)` : ''}`,
        badge: 'EVENT',
        badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        url: `/admin/activity`
      });
    });

    // 5. Notifications
    (results.notifications || []).forEach((n) => {
      items.push({
        type: 'notification',
        id: n.id,
        title: n.title,
        subtitle: `${n.description} ${n.merchant ? `(${n.merchant.name})` : ''}`,
        badge: n.type || 'NOTIFICATION',
        badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        url: `/admin/notifications`
      });
    });

    return items;
  }, [results, query]);

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
          placeholder="Search pages, disputes, merchants, activities..."
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-16 py-2 bg-muted/60 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
        />

        {/* Ctrl+K Shortcut Badge */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
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
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
              Searching admin resources...
            </div>
          ) : !hasResults ? (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-foreground">No results found</p>
              <p className="text-xs text-muted-foreground mt-1">No matching pages, disputes, merchants, or events for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto p-2 divide-y divide-border/50">
              {/* Group: PAGES (Sidebar Navigation Options) */}
              {flatResults.some((i) => i.type === 'page') && (
                <div className="py-2">
                  <div className="px-3 py-1 text-[11px] font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5 text-indigo-500" />
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
                              isSelected ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100' : 'hover:bg-muted/60 text-foreground'
                            }`}
                          >
                            <div className="min-w-0 flex-1 pr-3">
                              <div className="text-sm font-semibold truncate flex items-center gap-2">
                                {item.title}
                              </div>
                              <div className="text-xs text-muted-foreground truncate mt-0.5">{item.subtitle}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.badge && (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                                  {item.badge}
                                </span>
                              )}
                              {isSelected && <CornerDownLeft className="h-3.5 w-3.5 text-indigo-500" />}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Group: DISPUTES */}
              {results.disputes?.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-1 text-[11px] font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-indigo-500" />
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
                              isSelected ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100' : 'hover:bg-muted/60 text-foreground'
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
                              {isSelected && <CornerDownLeft className="h-3.5 w-3.5 text-indigo-500" />}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Group: MERCHANTS */}
              {results.merchants?.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-1 text-[11px] font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5 text-blue-500" />
                    Merchants
                  </div>
                  <div className="mt-1 space-y-1">
                    {flatResults
                      .filter((i) => i.type === 'merchant')
                      .map((item) => {
                        const globalIdx = flatResults.findIndex((r) => r.id === item.id && r.type === item.type);
                        const isSelected = globalIdx === selectedIndex;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                              isSelected ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100' : 'hover:bg-muted/60 text-foreground'
                            }`}
                          >
                            <div className="min-w-0 flex-1 pr-3">
                              <div className="text-sm font-semibold truncate">{item.title}</div>
                              <div className="text-xs text-muted-foreground truncate mt-0.5">{item.subtitle}</div>
                            </div>
                            {isSelected && <CornerDownLeft className="h-3.5 w-3.5 text-indigo-500" />}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Group: ACTIVITY */}
              {results.activities?.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-1 text-[11px] font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-purple-500" />
                    Activity
                  </div>
                  <div className="mt-1 space-y-1">
                    {flatResults
                      .filter((i) => i.type === 'activity')
                      .map((item) => {
                        const globalIdx = flatResults.findIndex((r) => r.id === item.id && r.type === item.type);
                        const isSelected = globalIdx === selectedIndex;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                              isSelected ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100' : 'hover:bg-muted/60 text-foreground'
                            }`}
                          >
                            <div className="min-w-0 flex-1 pr-3">
                              <div className="text-sm font-semibold truncate">{item.title}</div>
                              <div className="text-xs text-muted-foreground truncate mt-0.5">{item.subtitle}</div>
                            </div>
                            {isSelected && <CornerDownLeft className="h-3.5 w-3.5 text-indigo-500" />}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Group: NOTIFICATIONS */}
              {results.notifications?.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-1 text-[11px] font-bold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
                    <Bell className="h-3.5 w-3.5 text-amber-500" />
                    Notifications
                  </div>
                  <div className="mt-1 space-y-1">
                    {flatResults
                      .filter((i) => i.type === 'notification')
                      .map((item) => {
                        const globalIdx = flatResults.findIndex((r) => r.id === item.id && r.type === item.type);
                        const isSelected = globalIdx === selectedIndex;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setSelectedIndex(globalIdx)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                              isSelected ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-100' : 'hover:bg-muted/60 text-foreground'
                            }`}
                          >
                            <div className="min-w-0 flex-1 pr-3">
                              <div className="text-sm font-semibold truncate">{item.title}</div>
                              <div className="text-xs text-muted-foreground truncate mt-0.5">{item.subtitle}</div>
                            </div>
                            {isSelected && <CornerDownLeft className="h-3.5 w-3.5 text-indigo-500" />}
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

