"use client";

import AdminNavbar from "../layout/AdminNavbar";
import AdminSidebar from "../layout/AdminSidebar";
import { useState } from "react";

interface AdminAppShellProps {
    children: React.ReactNode;
}

export default function AdminAppShell({ children }: AdminAppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex min-h-screen bg-background transition-colors">

            {/* Sidebar - slides in/out via width transition */}
            <div className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${sidebarOpen ? "w-[260px]" : "w-0"}`}>
                <AdminSidebar />
            </div>

            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                <AdminNavbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />
                <main className="flex-1 p-8 bg-background overflow-x-auto">
                    {children}
                </main>
            </div>

        </div>
    );
}
