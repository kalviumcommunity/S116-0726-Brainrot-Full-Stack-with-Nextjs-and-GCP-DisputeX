"use client";

import { useEffect, useState } from "react";
import { Dispute, disputeService } from "@/services/dispute.service";
import { DisputeDetailsModal } from "@/components/disputes/DisputeDetailsModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setIsLoading(true);
      const res = await disputeService.getDisputes();
      if (res.disputes) {
        setDisputes(res.disputes);
      }
    } catch (err) {
      console.error("Failed to fetch disputes:", err);
      setError("Failed to load disputes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setIsModalOpen(true);
  };

  const handleDisputeUpdate = (updatedDispute: Dispute) => {
    setDisputes((prev) => prev.map((d) => d.id === updatedDispute.id ? updatedDispute : d));
    setSelectedDispute(updatedDispute);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "OPEN": return "default";
      case "UNDER_REVIEW": return "secondary";
      case "WON": return "outline";
      case "LOST": return "destructive";
      default: return "default";
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Disputes</CardTitle>
          <CardDescription>
            Manage and view all your disputes and upload necessary evidence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">Loading...</div>
          ) : error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : disputes.length === 0 ? (
            <div className="text-center p-8 text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-md">
              No disputes found.
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(dispute.status)}>
                          {dispute.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {dispute.amount.toLocaleString("en-US", { style: "currency", currency: dispute.currency })}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {dispute.reason}
                      </TableCell>
                      <TableCell>
                        {new Date(dispute.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(dispute)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DisputeDetailsModal 
        dispute={selectedDispute}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleDisputeUpdate}
      />
    </div>
  );
}
