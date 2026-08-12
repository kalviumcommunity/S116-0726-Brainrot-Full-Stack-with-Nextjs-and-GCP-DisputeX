"use client";

import AppShell from "@/components/common/AppShell";
import { AlertTriangle, Clock, Loader2, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { disputeService, Notification } from "@/services/dispute.service";

// For demo purposes, we'll hardcode the merchant ID. In a real app, this would come from auth context.
const DEMO_MERCHANT_ID = "00000000-0000-0000-0000-000000000000";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // In a real app, use the actual merchant ID from the logged-in user
      const response = await disputeService.getNotifications(DEMO_MERCHANT_ID);
      setNotifications(response.data?.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await disputeService.markNotificationAsRead(id);
      // Optimistic update
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = async () => {
    try {
      await disputeService.markAllNotificationsAsRead(DEMO_MERCHANT_ID);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  return (
    <AppShell>
      <div className="w-full max-w-7xl mx-auto flex flex-col font-sans p-2">
        {/* Header Section */}
        <div className="mb-6 flex justify-between items-end max-w-5xl">
          <div>
            <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-1 uppercase">Notifications</p>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Inbox</h1>
            <p className="text-sm text-muted-foreground mt-1">{unreadCount} unread of {notifications.length} total</p>
          </div>
          
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0 || isLoading}
            className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="h-4 w-4 mr-2" />
            Mark all read
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-card rounded-xl border border-border shadow-sm mb-6 max-w-5xl flex flex-col">
          <div className="flex flex-col divide-y divide-border">
            {isLoading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                No notifications found.
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex p-6 transition-colors ${notification.isRead ? 'bg-background opacity-70' : 'bg-muted/20 hover:bg-muted/40'}`}
                >
                  {/* Icon */}
                  <div className="mr-4 flex-shrink-0">
                    {notification.type === "escalated" ? (
                      <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center border border-red-100 dark:border-red-900">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center border border-indigo-100 dark:border-indigo-900">
                        <Clock className="h-5 w-5 text-indigo-500" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm font-semibold mb-1 ${notification.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs flex items-center gap-1 text-blue-500 hover:text-blue-600 font-medium"
                          title="Mark as read"
                        >
                          <Check className="h-3 w-3" />
                          Mark read
                        </button>
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${notification.isRead ? 'text-muted-foreground' : 'text-foreground/80'}`}>
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}