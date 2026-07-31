"use client";

import { Dispute, disputeService } from "@/services/dispute.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EvidenceUploadForm } from "./EvidenceUploadForm";
import { useState } from "react";

interface DisputeDetailsModalProps {
  dispute: Dispute | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedDispute: Dispute) => void;
}

export function DisputeDetailsModal({ dispute, isOpen, onClose, onUpdate }: DisputeDetailsModalProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!dispute) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      const res = await disputeService.updateDisputeStatus(dispute.id, newStatus);
      if (res.dispute) {
        onUpdate(res.dispute);
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleEvidenceUploaded = (evidenceUrl: string) => {
    onUpdate({ ...dispute, evidenceUrl });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "OPEN": return "default";
      case "UNDER_REVIEW": return "secondary";
      case "WON": return "outline"; // or a custom success variant
      case "LOST": return "destructive";
      default: return "default";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Dispute Details</DialogTitle>
          <DialogDescription>
            ID: {dispute.id}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-500">Status</h4>
              <Badge variant={getStatusBadgeVariant(dispute.status)} className="mt-1">
                {dispute.status}
              </Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slate-500">Amount Disputed</h4>
              <p className="text-xl font-semibold mt-1">
                {dispute.amount.toLocaleString("en-US", { style: "currency", currency: dispute.currency })}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-500">Reason</h4>
              <p className="mt-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-md text-sm">
                {dispute.reason}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slate-500">Created At</h4>
              <p className="text-sm mt-1">{new Date(dispute.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-500">Evidence</h4>
              {dispute.evidenceUrl ? (
                <div className="mt-1">
                  <a 
                    href={dispute.evidenceUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-blue-500 hover:underline text-sm flex items-center gap-2"
                  >
                    View Uploaded Evidence
                  </a>
                </div>
              ) : (
                <div className="mt-1">
                  <p className="text-sm text-slate-500 mb-2">No evidence uploaded yet.</p>
                  <EvidenceUploadForm disputeId={dispute.id} onUploadSuccess={handleEvidenceUploaded} />
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-slate-500 mb-2">Actions</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled={isUpdatingStatus || dispute.status === 'UNDER_REVIEW'}
                  onClick={() => handleStatusUpdate('UNDER_REVIEW')}
                >
                  Mark Under Review
                </Button>
                <Button 
                  size="sm" 
                  variant="default"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isUpdatingStatus || dispute.status === 'WON'}
                  onClick={() => handleStatusUpdate('WON')}
                >
                  Mark Won
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  disabled={isUpdatingStatus || dispute.status === 'LOST'}
                  onClick={() => handleStatusUpdate('LOST')}
                >
                  Mark Lost
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
