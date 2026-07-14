"use client";

import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";

interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({
    children,
}: AppShellProps) {
    return (
        <div className="flex min-h-screen bg-slate-100">

            <Sidebar />

            <div className="flex flex-1 flex-col">

                <Navbar />

                <main className="flex-1 p-6">
                    {children}
                </main>

            </div>

        </div>
    );
}