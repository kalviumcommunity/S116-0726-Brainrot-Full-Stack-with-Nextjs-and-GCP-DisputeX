"use client";
import AdminAppShell from "@/components/common/AdminAppShell";
import { Check } from "lucide-react";
import { useState } from "react";

const INITIAL_NOTIFICATIONS = [
    { id: 1, title: "Evidence uploaded", description: "2021-rolls-royce-ghost-vn-1920x1080.jpg", time: "09 JUL 2026, 01:23 PM", unread: true },
    { id: 2, title: "Reminder: DSP_D7C4DD4D0DC1", description: "Upload supporting evidence before the 7-day deadline expires.", time: "09 JUL 2026, 01:14 PM", unread: true },
    { id: 3, title: "Reminder: DSP_CC96E8D0A417", description: "Upload supporting evidence before the 7-day deadline expires.", time: "09 JUL 2026, 01:14 PM", unread: true },
    { id: 4, title: "Reminder: DSP_49F2DA9F8118", description: "Upload supporting evidence before the 7-day deadline expires.", time: "09 JUL 2026, 01:14 PM", unread: true },
    { id: 5, title: "Dispute DSP_8856A9F099F4 escalated", description: "This dispute was escalated because no evidence was submitted before the deadline.", time: "09 JUL 2026, 01:14 PM", unread: true },
    { id: 6, title: "Reminder: DSP_7849580CF87E", description: "Upload supporting evidence before the 7-day deadline expires.", time: "09 JUL 2026, 01:14 PM", unread: true },
    { id: 7, title: "Reminder: DSP_0314918797A3", description: "Upload supporting evidence before the 7-day deadline expires.", time: "09 JUL 2026, 01:13 PM", unread: true },
    { id: 8, title: "Reminder: DSP_F671DA64D653", description: "Upload supporting evidence before the 7-day deadline expires.", time: "09 JUL 2026, 01:13 PM", unread: true },
];

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    return (
        <AdminAppShell>
            <div className="max-w-7xl mx-auto py-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            <span className="text-red-500">ADMIN</span>
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-1">Notifications</h1>
                        <p className="text-muted-foreground">{unreadCount} unread</p>
                    </div>
                    <button 
                        onClick={handleMarkAllRead}
                        disabled={unreadCount === 0}
                        className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Check className="h-4 w-4 mr-2" />
                        Mark all read
                    </button>
                </div>

                <div className="bg-card rounded-lg shadow-sm border border-border">
                    <div className="divide-y divide-border">
                        {notifications.map((notification) => (
                            <div key={notification.id} className="p-4 hover:bg-muted/40 transition-colors flex items-start gap-3">
                                <div className="mt-1.5 flex-shrink-0 w-2 h-2 flex justify-center">
                                    {notification.unread && (
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    )}
                                </div>
                                <div>
                                    <h3 className={`text-sm font-medium ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{notification.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                                    <p className="text-xs text-muted-foreground/60 mt-1">{notification.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminAppShell>
    );
}