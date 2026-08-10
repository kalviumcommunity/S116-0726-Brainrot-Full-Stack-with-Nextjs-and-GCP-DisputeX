"use client";
import AdminAppShell from "@/components/common/AdminAppShell";
import { Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const response = await api.get('/admin/merchants');
        setMerchants(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch merchants:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMerchants();
  }, []);

  return (
    <AdminAppShell>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              <span className="text-red-500">ADMIN</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Merchants</h1>
            <p className="text-muted-foreground">{merchants.length} merchants onboarded</p>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">MERCHANT</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">MERCHANT ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">EMAIL</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">BUSINESS</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">DISPUTES</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">JOINED</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
                    </td>
                  </tr>
                ) : merchants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No merchants found.
                    </td>
                  </tr>
                ) : (
                  merchants.map((merchant, index) => (
                    <tr key={index} className="hover:bg-muted/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{merchant.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{merchant.businessId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{merchant.contactEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">{merchant.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground text-right font-medium">{merchant._count?.disputes || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground text-right">
                        {new Date(merchant.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminAppShell>
  );
}