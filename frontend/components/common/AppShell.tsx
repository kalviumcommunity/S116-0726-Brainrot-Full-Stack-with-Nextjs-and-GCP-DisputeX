"use client";

import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";
import { useState } from "react";

interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-background transition-colors overflow-hidden">

            {/* Sidebar - slides in/out via width transition */}
            <div className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${sidebarOpen ? "w-64" : "w-0"}`}>
                <Sidebar />
            </div>

            <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
                <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />
                <main className="flex-1 p-6 bg-background overflow-y-auto">
                    {children}
                </main>
            </div>

        </div>
    );
}