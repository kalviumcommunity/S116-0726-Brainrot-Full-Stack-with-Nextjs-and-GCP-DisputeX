"use client";

import AdminAppShell from "@/components/common/AdminAppShell";
import { ArrowLeft, Loader2, FileText, CheckCircle2, Activity as ActivityIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { disputeService, Dispute, Activity as ActivityType } from "@/services/dispute.service";

export default function AdminDisputeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [activeTab, setActiveTab] = useState<'evidence' | 'timeline'>('evidence');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [disputeData, activitiesData] = await Promise.all([
          disputeService.getDisputeById(id),
          disputeService.getDisputeActivities(id)
        ]);
        setDispute(disputeData.data.dispute);
        setActivities(activitiesData.data.activities || []);
      } catch (error) {
        console.error("Failed to fetch dispute details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    setIsUpdatingStatus(true);
    try {
      const response = await disputeService.updateDisputeStatus(id, status);
      if (response.data && response.data.dispute) {
        setDispute(response.data.dispute);
        // Refresh activities
        const activitiesData = await disputeService.getDisputeActivities(id);
        setActivities(activitiesData.data.activities || []);
      }
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <AdminAppShell>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminAppShell>
    );
  }

  if (!dispute) {
    return (
      <AdminAppShell>
        <div className="w-full max-w-7xl mx-auto font-sans p-6 text-center text-muted-foreground">
          Dispute not found.
        </div>
      </AdminAppShell>
    );
  }

  const isResolved = dispute.status === 'WON' || dispute.status === 'LOST';

  return (
    <AdminAppShell>
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full font-sans p-6">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/admin/disputes" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            All disputes
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{dispute.id}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground text-xs font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></div>
                  {dispute.status}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Dispute filed for merchant <span className="font-semibold text-foreground">{dispute.merchant?.name || "Unknown"}</span>
              </p>
            </div>
            
            <div className="text-left md:text-right">
              <h2 className="text-3xl font-bold text-foreground">{dispute.currency} {dispute.amount.toFixed(2)}</h2>
              <p className="text-muted-foreground text-sm mt-1">Reason: {dispute.reason}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mt-8">
            <div>
              <p className="text-xs font-semibold text-muted-foreground tracking-wider mb-2 uppercase">Status</p>
              <div className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium mb-1 ${isResolved ? 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'}`}>
                {isResolved ? 'Resolved' : 'Action Required'}
              </div>
              <p className="text-xs text-muted-foreground">Created on {new Date(dispute.createdAt).toLocaleString()}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">Update Status:</span>
              <select 
                className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dispute.status}
                disabled={isUpdatingStatus}
                onChange={(e) => handleUpdateStatus(e.target.value)}
              >
                <option value="OPEN">Open</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="WON">Won</option>
                <option value="LOST">Lost</option>
                <option value="ESCALATED">Escalated</option>
              </select>
              {isUpdatingStatus && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-xl border border-border shadow-sm mb-6">
          <div className="flex flex-wrap border-b border-border p-1 gap-1">
            <button 
              onClick={() => setActiveTab('evidence')}
              className={`flex-1 min-w-[120px] py-2.5 text-sm rounded-lg transition-colors ${activeTab === 'evidence' ? 'font-semibold bg-background shadow-sm border border-border text-foreground' : 'font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              Evidence
            </button>
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 min-w-[120px] py-2.5 text-sm rounded-lg transition-colors ${activeTab === 'timeline' ? 'font-semibold bg-background shadow-sm border border-border text-foreground' : 'font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              Timeline
            </button>
          </div>
        </div>

        {/* Evidence Tab Content */}
        {activeTab === 'evidence' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* History Card */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 min-h-[200px] flex flex-col col-span-1 lg:col-span-2">
              <h3 className="font-bold text-foreground mb-1">Evidence</h3>
              <p className="text-sm text-muted-foreground mb-6">{dispute.evidenceUrl ? '1' : '0'} file(s) attached by merchant</p>
              
              <div className="flex-1 flex flex-col items-start justify-center text-sm text-muted-foreground/60 w-full">
                {dispute.evidenceUrl ? (
                  <div className="w-full flex items-center p-4 rounded-lg border border-border bg-muted/30 gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-600 dark:text-blue-300">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-foreground truncate">evidence_file</p>
                      <p className="text-sm text-muted-foreground mt-1">Uploaded securely via GCP Storage</p>
                    </div>
                    <a 
                      href={dispute.evidenceUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      View File
                    </a>
                  </div>
                ) : (
                  <div className="text-center w-full py-8">
                    No evidence uploaded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Timeline Tab Content */}
        {activeTab === 'timeline' && (
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h3 className="font-bold text-foreground mb-6">Dispute Timeline</h3>
            {activities.length === 0 ? (
              <p className="text-muted-foreground text-sm">No activity recorded yet.</p>
            ) : (
              <div className="relative border-l border-border ml-3 space-y-6">
                {activities.map((activity, idx) => (
                  <div key={activity.id} className="relative pl-6">
                    <div className="absolute -left-3 top-1 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 border-4 border-card flex items-center justify-center">
                      <ActivityIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="mb-1">
                      <span className="text-sm font-semibold text-foreground mr-2">{activity.action.replace(/_/g, ' ')}</span>
                      <span className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </AdminAppShell>
  );
}
