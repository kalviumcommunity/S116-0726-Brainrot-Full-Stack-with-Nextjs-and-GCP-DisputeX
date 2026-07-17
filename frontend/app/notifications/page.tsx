"use client";

import AppShell from "@/components/common/AppShell";
import { AlertTriangle, Clock } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "escalated",
    title: "Dispute DSP_E2185643C3AC escalated",
    description: "This dispute was escalated because no evidence was submitted before the deadline.",
    date: "08 Jul 2026, 04:51 pm"
  },
  {
    id: 2,
    type: "reminder",
    title: "Reminder: DSP_A8F36651354D",
    description: "Upload supporting evidence before the 7-day deadline expires.",
    date: "08 Jul 2026, 04:51 pm"
  },
  {
    id: 3,
    type: "reminder",
    title: "Reminder: DSP_FA715D3BC86C",
    description: "Upload supporting evidence before the 7-day deadline expires.",
    date: "08 Jul 2026, 04:51 pm"
  },
  {
    id: 4,
    type: "reminder",
    title: "Reminder: DSP_F7E9B1609C08",
    description: "Upload supporting evidence before the 7-day deadline expires.",
    date: "08 Jul 2026, 04:51 pm"
  },
  {
    id: 5,
    type: "reminder",
    title: "Reminder: DSP_FBF53EF96745",
    description: "Upload supporting evidence before the 7-day deadline expires.",
    date: "08 Jul 2026, 04:51 pm"
  }
];

export default function NotificationsPage() {
  return (
    <AppShell>
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full bg-slate-50 font-sans p-2">
        {/* Header Section */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-500 tracking-wider mb-1 uppercase">Notifications</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inbox</h1>
          <p className="text-sm text-slate-500 mt-1">0 unread of 5 total</p>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6 flex-1 max-w-5xl">
          <div className="flex flex-col divide-y divide-slate-100">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex p-6 hover:bg-slate-50/80 transition-colors">

                {/* Icon */}
                <div className="mr-4 flex-shrink-0">
                  {notification.type === "escalated" ? (
                    <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                      <Clock className="h-5 w-5 text-indigo-500" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2">
                    {notification.description}
                  </p>
                  <p className="text-xs text-slate-400">
                    {notification.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}