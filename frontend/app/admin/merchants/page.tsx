"use client";
import AdminAppShell from "@/components/common/AdminAppShell";
import { Search } from "lucide-react";

const DUMMY_MERCHANTS = [
  {
    merchant: "yashu",
    merchantId: "MID_64A78411FE",
    email: "yash@gmail.com",
    business: "—",
    disputes: "0",
    joined: "22 Jul 2026",
  },
  {
    merchant: "yashraj",
    merchantId: "MID_74FCB8B590",
    email: "onen683530909@gmail.com",
    business: "—",
    disputes: "0",
    joined: "22 Jul 2026",
  },
  {
    merchant: "meowww",
    merchantId: "MID_E903FB36D5",
    email: "raoo@gmail.com",
    business: "—",
    disputes: "0",
    joined: "21 Jul 2026",
  },
  {
    merchant: "shuubham",
    merchantId: "MID_70B4E221D1",
    email: "shubh12345@gmail.com",
    business: "—",
    disputes: "0",
    joined: "21 Jul 2026",
  },
  {
    merchant: "shuubham",
    merchantId: "MID_2381ED2428",
    email: "shubh@gmail.com",
    business: "—",
    disputes: "0",
    joined: "21 Jul 2026",
  },
  {
    merchant: "wwww",
    merchantId: "MID_B4C43A2A8C",
    email: "wwww@gmail.com",
    business: "—",
    disputes: "0",
    joined: "14 Jul 2026",
  },
  {
    merchant: "mmm",
    merchantId: "MID_666B0375E8",
    email: "mmm@gmail.com",
    business: "—",
    disputes: "0",
    joined: "14 Jul 2026",
  },
  {
    merchant: "hihihih123",
    merchantId: "MID_ED80303FE1",
    email: "hihihih123@gmail.com",
    business: "—",
    disputes: "0",
    joined: "14 Jul 2026",
  },
  {
    merchant: "atharv",
    merchantId: "MID_CBDB4407B9",
    email: "atharv@gmail.com",
    business: "—",
    disputes: "0",
    joined: "10 Jul 2026",
  },
  {
    merchant: "om",
    merchantId: "MID_532D3904EA",
    email: "om@gamil.com",
    business: "—",
    disputes: "0",
    joined: "10 Jul 2026",
  },
  {
    merchant: "yashraj",
    merchantId: "MID_6AA9503C22",
    email: "yashraj@gmail.com",
    business: "—",
    disputes: "0",
    joined: "10 Jul 2026",
  },
  {
    merchant: "Shubham Reddy",
    merchantId: "MID_4992CCDF4B",
    email: "name@gmail.com",
    business: "—",
    disputes: "0",
    joined: "10 Jul 2026",
  },
  {
    merchant: "Shubham Reddy",
    merchantId: "MID_3899D2B800",
    email: "reddyshubham061206@gmail.com",
    business: "—",
    disputes: "0",
    joined: "10 Jul 2026",
  },
  {
    merchant: "Test User",
    merchantId: "MID_909BA25A25",
    email: "test@example.com",
    business: "—",
    disputes: "0",
    joined: "10 Jul 2026",
  },
];

export default function AdminMerchantsPage() {
  return (
    <AdminAppShell>
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-8">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <span className="text-red-500">ADMIN</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Merchants</h1>
          <p className="text-gray-500">23 merchants onboarded</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    MERCHANT
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    MERCHANT ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    BUSINESS
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    DISPUTES
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    JOINED
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {DUMMY_MERCHANTS.map((merchant, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {merchant.merchant}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {merchant.merchantId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {merchant.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {merchant.business}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {merchant.disputes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {merchant.joined}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminAppShell>
  );
}