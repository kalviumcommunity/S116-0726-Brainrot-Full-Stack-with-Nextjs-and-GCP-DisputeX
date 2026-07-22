"use client";
import AdminAppShell from "@/components/common/AdminAppShell";
import { Search, ChevronDown, Eye, Clock, ShieldAlert, CheckCircle, XCircle, Check } from "lucide-react";
import { useState } from "react";

const DUMMY_DISPUTES = [
  {
    id: "DSP_CC96E8D0A417",
    merchant: "Aditya Patel",
    transaction: "pay_YTERM3G2QH",
    amount: "₹36,229.20",
    created: "09 Jul 2026",
    deadline: "Expired",
    status: "Pending",
    priority: "NORMAL",
  },
  {
    id: "DSP_7141990BC6A7",
    merchant: "Aditya Patel",
    transaction: "pay_7X5IB8QTAR",
    amount: "₹28,204.71",
    created: "09 Jul 2026",
    deadline: "Expired",
    status: "Pending",
    priority: "NORMAL",
  },
  {
    id: "DSP_4FB14A1BF136",
    merchant: "Kabir Mehta",
    transaction: "pay_Y9GEB7VCWE",
    amount: "₹27,163.35",
    created: "09 Jul 2026",
    deadline: "Expired",
    status: "Pending",
    priority: "NORMAL",
  },
  {
    id: "DSP_BB22DF6410E5",
    merchant: "Rohan Verma",
    transaction: "pay_WA929YAXHC",
    amount: "₹8,794.68",
    created: "08 Jul 2026",
    deadline: "Expired",
    status: "Pending",
    priority: "NORMAL",
  },
  {
    id: "DSP_B3DAC27C2E2F",
    merchant: "Neha Gupta",
    transaction: "pay_FQPTHDQQRS",
    amount: "₹13,178.52",
    created: "08 Jul 2026",
    deadline: "Expired",
    status: "Responded",
    priority: "NORMAL",
  },
  {
    id: "DSP_11270BDCE521",
    merchant: "Meera Nair",
    transaction: "pay_4OBL9BVS3T",
    amount: "₹38,860.17",
    created: "08 Jul 2026",
    deadline: "Expired",
    status: "Pending",
    priority: "NORMAL",
  },
  {
    id: "DSP_BBC5DFE7DC2C",
    merchant: "Sana Khan",
    transaction: "pay_AB306CGXT4",
    amount: "₹15,224.34",
    created: "08 Jul 2026",
    deadline: "Expired",
    status: "Pending",
    priority: "NORMAL",
  },
  {
    id: "DSP_8548F5756E65",
    merchant: "Ananya Sharma",
    transaction: "pay_55PTQL0U0I",
    amount: "₹35,639.42",
    created: "08 Jul 2026",
    deadline: "Expired",
    status: "Won",
    priority: "NORMAL",
  },
  {
    id: "DSP_005665E7D944",
    merchant: "Sana Khan",
    transaction: "pay_RAPSXY1RXF",
    amount: "₹21,267.26",
    created: "08 Jul 2026",
    deadline: "Expired",
    status: "Pending",
    priority: "NORMAL",
  },
];

export default function AdminDisputesPage() {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All statuses");
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("All priorities");

  const statuses = [
    "All statuses",
    "Open",
    "Submitted",
    "Escalated",
    "Won",
    "Lost"
  ];

  const priorities = [
    "All priorities",
    "Low",
    "Normal",
    "High",
    "Urgent"
  ];

  return (
    <AdminAppShell>
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-8">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            <span className="text-red-500">ADMIN</span> <span className="mx-2">&middot;</span> DISPUTES
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">All Disputes</h1>
          <p className="text-gray-500">60 of 60 disputes</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px] relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by ref, transaction, customer..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="relative">
              <button
                type="button"
                className="inline-flex justify-between items-center w-[160px] px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                {selectedStatus}
                <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
              </button>
              
              {isStatusDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-[160px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        className={`block px-4 py-2 text-sm text-left w-full hover:bg-blue-50 ${selectedStatus === status ? 'bg-blue-50 text-blue-900' : 'text-gray-700'}`}
                        role="menuitem"
                        onClick={() => {
                          setSelectedStatus(status);
                          setIsStatusDropdownOpen(false);
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                className="inline-flex justify-between items-center w-[140px] px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
              >
                {selectedPriority}
                <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
              </button>
              
              {isPriorityDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-[140px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    {priorities.map((priority) => (
                      <button
                        key={priority}
                        className={`block px-4 py-2 text-sm text-left w-full hover:bg-blue-50 ${selectedPriority === priority ? 'bg-blue-50 text-blue-900' : 'text-gray-700'}`}
                        role="menuitem"
                        onClick={() => {
                          setSelectedPriority(priority);
                          setIsPriorityDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{priority}</span>
                          {selectedPriority === priority && <Check className="h-4 w-4 text-slate-900" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispute ID ↑↓
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Merchant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ↑↓
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount ↑↓
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created ↑↓
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline ↑↓
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {DUMMY_DISPUTES.map((dispute) => (
                  <tr key={dispute.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dispute.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dispute.merchant}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dispute.transaction}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {dispute.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dispute.created}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center text-red-600 font-medium text-xs bg-red-50 px-2 py-1 rounded-full w-fit">
                         <Clock className="w-3 h-3 mr-1" />
                        {dispute.deadline}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        dispute.status === 'Pending' ? 'bg-orange-100 text-orange-800' : 
                        dispute.status === 'Responded' ? 'bg-blue-100 text-blue-800' :
                        dispute.status === 'Won' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          dispute.status === 'Pending' ? 'bg-orange-400' : 
                          dispute.status === 'Responded' ? 'bg-blue-400' :
                          dispute.status === 'Won' ? 'bg-green-400' :
                          'bg-gray-400'
                        }`}></span>
                        {dispute.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        {dispute.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-900 transition-colors">
                        <Eye className="h-5 w-5 mx-auto" />
                      </button>
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
