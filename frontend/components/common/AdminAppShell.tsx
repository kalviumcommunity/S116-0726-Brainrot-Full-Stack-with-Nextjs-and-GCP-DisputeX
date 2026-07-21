"use client";

import AdminNavbar from "../layout/AdminNavbar";
import AdminSidebar from "../layout/AdminSidebar";

interface AdminAppShellProps {
    children: React.ReactNode;
}

export default function AdminAppShell({
    children,
}: AdminAppShellProps) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <div className="flex flex-1 flex-col">
                <AdminNavbar />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
