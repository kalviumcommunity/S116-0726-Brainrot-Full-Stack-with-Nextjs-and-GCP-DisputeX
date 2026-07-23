"use client";
import AdminAppShell from "@/components/common/AdminAppShell";
import { Check } from "lucide-react";

const DUMMY_NOTIFICATIONS = [
    {
        title: "Evidence uploaded",
        description: "2021-rolls-royce-ghost-vn-1920x1080.jpg",
        time: "09 JUL 2026, 01:23 PM",
        unread: true,
    },
    {
        title: "Reminder: DSP_D7C4DD4D0DC1",
        description: "Upload supporting evidence before the 7-day deadline expires.",
        time: "09 JUL 2026, 01:14 PM",
        unread: true,
    },
    {
        title: "Reminder: DSP_CC96E8D0A417",
        description: "Upload supporting evidence before the 7-day deadline expires.",
        time: "09 JUL 2026, 01:14 PM",
        unread: true,
    },
    {
        title: "Reminder: DSP_49F2DA9F8118",
        description: "Upload supporting evidence before the 7-day deadline expires.",
        time: "09 JUL 2026, 01:14 PM",
        unread: true,
    },
    {
        title: "Dispute DSP_8856A9F099F4 escalated",
        description: "This dispute was escalated because no evidence was submitted before the deadline.",
        time: "09 JUL 2026, 01:14 PM",
        unread: true,
    },
    {
        title: "Reminder: DSP_7849580CF87E",
        description: "Upload supporting evidence before the 7-day deadline expires.",
        time: "09 JUL 2026, 01:14 PM",
        unread: true,
    },
    {
        title: "Reminder: DSP_0314918797A3",
        description: "Upload supporting evidence before the 7-day deadline expires.",
        time: "09 JUL 2026, 01:13 PM",
        unread: true,
    },
    {
        title: "Reminder: DSP_F671DA64D653",
        description: "Upload supporting evidence before the 7-day deadline expires.",
        time: "09 JUL 2026, 01:13 PM",
        unread: true,
    }
];

export default function AdminNotificationsPage() {
    return (
        <AdminAppShell>
            <div className="max-w-7xl mx-auto py-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            <span className="text-red-500">ADMIN</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Notifications</h1>
                        <p className="text-gray-500">26 unread</p>
                    </div>

                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Check className="h-4 w-4 mr-2" />
                        Mark all read
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="divide-y divide-gray-200">
                        {DUMMY_NOTIFICATIONS.map((notification, index) => (
                            <div key={index} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-3">
                                <div className="mt-1.5 flex-shrink-0">
                                    {notification.unread && (
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{notification.description}</p>
                                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminAppShell>
    );
}