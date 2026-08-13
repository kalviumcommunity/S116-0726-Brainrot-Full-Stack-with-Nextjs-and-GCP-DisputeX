"use client";

import { useState } from "react";
import { disputeService } from "@/services/dispute.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EvidenceUploadFormProps {
  disputeId: string;
  onUploadSuccess?: (evidenceUrl: string) => void;
}

export function EvidenceUploadForm({ disputeId, onUploadSuccess }: EvidenceUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      const response = await disputeService.uploadEvidence(disputeId, file);
      
      if (onUploadSuccess && response.dispute?.evidenceUrl) {
        onUploadSuccess(response.dispute.evidenceUrl);
      }
      
      setFile(null); // Reset form
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to upload evidence.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col gap-2">
        <Label htmlFor="evidence-file">Upload Evidence (Image or PDF)</Label>
        <Input 
          id="evidence-file" 
          type="file" 
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />
        {file && (
          <p className="text-sm text-slate-500">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button 
        onClick={handleUpload} 
        disabled={!file || isUploading}
        className="w-full sm:w-auto"
      >
        {isUploading ? "Uploading..." : "Upload Evidence"}
      </Button>
    </div>
  );
}
