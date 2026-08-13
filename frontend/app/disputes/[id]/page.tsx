"use client";

import AppShell from "@/components/common/AppShell";
import { ArrowLeft, Send, Upload, Loader2, FileText, CheckCircle2, Activity as ActivityIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { disputeService, Dispute, Activity as ActivityType } from "@/services/dispute.service";

export default function DisputeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [activeTab, setActiveTab] = useState<'evidence' | 'timeline'>('evidence');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Quick validation
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit");
      return;
    }
    
    setIsUploading(true);
    setUploadError("");
    
    try {
      const response = await disputeService.uploadEvidence(id, file);
      if (response.data && response.data.evidenceUrl) {
        setDispute(prev => prev ? { ...prev, evidenceUrl: response.data.evidenceUrl } : null);
        // Refresh activities
        const activitiesData = await disputeService.getDisputeActivities(id);
        setActivities(activitiesData.data.activities || []);
      }
    } catch (error: any) {
      console.error("Upload failed", error);
      setUploadError(error.response?.data?.message || error.response?.data?.error || "Failed to upload evidence");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  if (!dispute) {
    return (
      <AppShell>
        <div className="w-full max-w-7xl mx-auto font-sans p-6 text-center text-muted-foreground">
          Dispute not found.
        </div>
      </AppShell>
    );
  }

  const isResolved = dispute.status === 'WON' || dispute.status === 'LOST';

  return (
    <AppShell>
      <div className="w-full max-w-7xl mx-auto font-sans p-6">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/disputes" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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
            
            <button 
              disabled={isResolved || !!dispute.evidenceUrl}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
                isResolved || !!dispute.evidenceUrl 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-90' 
                  : 'bg-[#9b87f5] hover:bg-[#8a74f2] text-white'
              }`}
            >
              <Send className="h-4 w-4" />
              {dispute.evidenceUrl ? 'Response submitted' : 'Submit response'}
            </button>
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

        {activeTab === 'evidence' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Card */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 min-h-[200px]">
              <h3 className="font-bold text-foreground mb-2">Upload new evidence</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Uploads are immutable once saved. A cryptographic hash is generated for each file. Max size: 5MB.
              </p>

              {dispute.evidenceUrl ? (
                 <div className="bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 flex items-center gap-3 text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Evidence already submitted for this dispute.</span>
                 </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-muted/30">
                  <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mb-4">SVG, PNG, JPG or PDF (max. 5MB)</p>
                  
                  <input
                    type="file"
                    id="evidence-upload"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    disabled={isUploading || isResolved}
                  />
                  
                  <label
                    htmlFor="evidence-upload"
                    className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-foreground bg-background border border-border transition-colors ${
                      isUploading || isResolved ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted cursor-pointer'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Uploading...
                      </>
                    ) : (
                      "Select file"
                    )}
                  </label>
                  {uploadError && <p className="text-red-500 text-sm mt-3">{uploadError}</p>}
                </div>
              )}
            </div>

            {/* History Card */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6 min-h-[200px] flex flex-col">
              <h3 className="font-bold text-foreground mb-1">Immutable evidence history</h3>
              <p className="text-sm text-muted-foreground mb-6">{dispute.evidenceUrl ? '1' : '0'} file(s) attached</p>
              
              <div className="flex-1 flex flex-col items-center justify-center text-sm text-muted-foreground/60">
                {dispute.evidenceUrl ? (
                  <div className="w-full flex items-center p-3 rounded-lg border border-border bg-muted/30 gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md text-blue-600 dark:text-blue-300">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">evidence_file</p>
                      <p className="text-xs text-muted-foreground">Uploaded securely to Cloudinary</p>
                    </div>
                    <button 
                      onClick={async () => {
                        try {
                          const res = await disputeService.getEvidenceUrl(dispute.id);
                          if (res.data?.evidenceUrl) {
                            window.open(res.data.evidenceUrl, '_blank');
                          }
                        } catch (e) {
                          console.error('Failed to view evidence', e);
                        }
                      }}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium text-left"
                    >
                      View
                    </button>
                  </div>
                ) : (
                  "No evidence uploaded yet."
                )}
              </div>
            </div>
          </div>
        )}

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
    </AppShell>
  );
}
