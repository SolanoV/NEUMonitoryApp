// components/MoaTable.tsx
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import EditMoaModal from "@/components/EditMoaModal";

interface Moa {
  id: string;
  hteId: string;
  companyName: string;
  address: string;
  contactPerson: string;
  email: string;
  industry: string;
  effectiveDate: string;
  status: string;
  endorsedBy: string;
  auditTrail: string;
  isDeleted: boolean;
}

interface MoaTableProps {
  searchTerm?: string;
  filterIndustry?: string;
  filterStatus?: string;
}

export default function MoaTable({ searchTerm = "", filterIndustry = "", filterStatus = "" }: MoaTableProps) {
  const { user, role } = useAuth();
  const [moas, setMoas] = useState<Moa[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMoa, setSelectedMoa] = useState<Moa | null>(null);

  // Helper to map Supabase snake_case to frontend camelCase
  const mapMoaData = (data: any[]): Moa[] => {
    return data.map(dbMoa => ({
      id: dbMoa.id,
      hteId: dbMoa.hte_id,
      companyName: dbMoa.company_name,
      address: dbMoa.address,
      contactPerson: dbMoa.contact_person,
      email: dbMoa.email,
      industry: dbMoa.industry,
      effectiveDate: dbMoa.effective_date,
      status: dbMoa.status,
      endorsedBy: dbMoa.endorsed_by,
      auditTrail: dbMoa.audit_trail,
      isDeleted: dbMoa.is_deleted
    }));
  };

  const fetchMoas = async () => {
    const { data, error } = await supabase
      .from("moas")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (data) setMoas(mapMoaData(data));
    setLoading(false);
  };

  useEffect(() => {
    // Initial fetch
    fetchMoas();

    // Listen to real-time changes
    const channel = supabase
      .channel("public:moas")
      .on("postgres_changes", { event: "*", schema: "public", table: "moas" }, () => {
        fetchMoas(); // Refetch on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSoftDelete = async (moaId: string, companyName: string) => {
    if (!window.confirm(`Are you sure you want to delete the MOA for ${companyName}?`)) return;
    
    try {
      // 1. Update the MOA document
      await supabase
        .from("moas")
        .update({
          is_deleted: true,
          audit_trail: `Deleted by ${user?.email} on ${new Date().toLocaleDateString()}`
        })
        .eq("id", moaId);

      // 2. Add an Audit Log
      await supabase.from("audit_logs").insert([{
        moa_id: moaId,
        company_name: companyName,
        user_email: user?.email,
        action: "SOFT_DELETE"
      }]);
    } catch (error) {
      console.error("Error deleting MOA:", error);
      alert("Failed to delete MOA.");
    }
  };

  const handleRecover = async (moaId: string, companyName: string) => {
    if (!window.confirm(`Are you sure you want to recover the MOA for ${companyName}?`)) return;

    try {
      // 1. Update the MOA document
      await supabase
        .from("moas")
        .update({
          is_deleted: false,
          audit_trail: `Recovered by ${user?.email} on ${new Date().toLocaleDateString()}`
        })
        .eq("id", moaId);

      // 2. Add an Audit Log
      await supabase.from("audit_logs").insert([{
        moa_id: moaId,
        company_name: companyName,
        user_email: user?.email,
        action: "RECOVER"
      }]);
    } catch (error) {
      console.error("Error recovering MOA:", error);
      alert("Failed to recover MOA.");
    }
  };

  // Remaining component logic (filters and return render) is exactly the same
  if (loading) {
    return (
      <div className="mt-8 p-8 border border-gray-200 rounded-lg text-center text-gray-500 bg-white shadow-sm">
        <div className="animate-pulse">Loading MOA data...</div>
      </div>
    );
  }

  if (moas.length === 0) {
    return (
      <div className="mt-8 p-8 border border-gray-200 rounded-lg text-center text-gray-500 bg-white shadow-sm">
        No MOA records found in the database.
      </div>
    );
  }

  let filteredMoas = role === "admin" ? moas : moas.filter(moa => !moa.isDeleted);

  filteredMoas = filteredMoas.filter((moa) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      moa.hteId?.toLowerCase().includes(searchLower) ||
      moa.companyName?.toLowerCase().includes(searchLower) ||
      moa.contactPerson?.toLowerCase().includes(searchLower) ||
      moa.address?.toLowerCase().includes(searchLower);

    const matchesIndustry = filterIndustry === "" || moa.industry === filterIndustry;
    const matchesStatus = filterStatus === "" || moa.status?.includes(filterStatus);

    return matchesSearch && matchesIndustry && matchesStatus;
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mt-6 transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
          <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {role !== "student" && <th className="px-4 py-3">HTE ID</th>}
              <th className="px-4 py-3">Company Info</th>
              <th className="px-4 py-3">Contact Person</th>
              {role !== "student" && (
                <>
                  <th className="px-4 py-3">Industry / College</th>
                  <th className="px-4 py-3">Status / Date</th>
                </>
              )}
              {role === "admin" && (
                <>
                  <th className="px-4 py-3">Audit Trail</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredMoas.map((moa) => (
              <tr 
                key={moa.id} 
                className={`border-b border-gray-100 dark:border-gray-800 transition-colors ${
                  moa.isDeleted 
                    ? "bg-red-50 dark:bg-red-900/20 opacity-75" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                {role !== "student" && (
                  <td className="px-4 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {moa.hteId || "N/A"}
                  </td>
                )}
                <td className="px-4 py-4">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{moa.companyName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{moa.address}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-gray-800 dark:text-gray-200">{moa.contactPerson}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{moa.email}</p>
                </td>
                
                {role !== "student" && (
                  <>
                    <td className="px-4 py-4">
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-300 dark:border-gray-600">
                        {moa.industry || "Unknown"}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Endorsed: {moa.endorsedBy}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded border ${
                        moa.status?.includes("APPROVED") ? "bg-neu-light text-neu-black border-neu-secondary" : 
                        moa.status?.includes("PROCESSING") ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700" : 
                        "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-300 dark:border-red-700"
                      }`}>
                        {moa.status || "Unknown"}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Effective: {moa.effectiveDate}</p>
                    </td>
                  </>
                )}

                {role === "admin" && (
                  <>
                    <td className="px-4 py-4 text-xs italic text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {moa.auditTrail || "No trail"}
                      {moa.isDeleted && <span className="block text-red-600 dark:text-red-400 font-bold mt-1">(DELETED)</span>}
                    </td>
                    <td className="px-4 py-4 text-right space-x-2 whitespace-nowrap">
                        {!moa.isDeleted ? (
                            <>
                                <button 
                                    onClick={() => {
                                      setSelectedMoa(moa);
                                      setIsEditModalOpen(true);
                                    }}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium text-xs transition"
                                >
                                    Edit
                                </button>
                                <button 
                                onClick={() => handleSoftDelete(moa.id, moa.companyName)}
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 font-medium text-xs transition"
                                >
                                Delete
                                </button>
                            </>
                        ) : (
                                <button 
                                onClick={() => handleRecover(moa.id, moa.companyName)}
                                className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 font-medium text-xs transition"
                                >
                                Recover
                                </button>
                        )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isEditModalOpen && selectedMoa && (
          <EditMoaModal 
            isOpen={isEditModalOpen} 
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedMoa(null);
            }} 
            moaData={selectedMoa} 
          />
        )}
    </div>
  );
}