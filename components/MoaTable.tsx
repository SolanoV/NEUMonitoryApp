// components/MoaTable.tsx
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import EditMoaModal from "@/components/EditMoaModal";
import AuditTrailModal from "@/components/AuditTrailModal";

interface Moa {
  id: string;
  hteId: string;
  companyName: string;
  address: string;
  contactPerson: string;
  email: string;
  industry: string;
  effectiveDate: string;
  expirationDate: string | null;
  status: string;
  endorsedBy: string;
  isDeleted: boolean;
}

interface MoaTableProps {
  searchTerm: string;
  filterCollege: string;
  filterIndustry: string;
  filterStatus: string;
  startDate: string;
  endDate: string;
}

export default function MoaTable({ 
  searchTerm = "", 
  filterCollege = "", 
  filterIndustry = "", 
  filterStatus = "", 
  startDate = "", 
  endDate = "" 
}: MoaTableProps) {
  const { user, role } = useAuth();
  const [moas, setMoas] = useState<Moa[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  // Modals & Menus States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMoa, setSelectedMoa] = useState<Moa | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  // Audit Trail State
  const [auditModalMoaId, setAuditModalMoaId] = useState<string | null>(null);
  const [auditModalCompanyName, setAuditModalCompanyName] = useState("");

  // Custom Confirmation Modal State
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: "delete" as "delete" | "recover" | null,
    moaId: "",
    companyName: "",
    isLoading: false,
    error: ""
  });

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
      expirationDate: dbMoa.expiration_date,
      status: dbMoa.status,
      endorsedBy: dbMoa.endorsed_by,
      isDeleted: dbMoa.is_deleted
    }));
  };

  const fetchMoas = async () => {
    const { data } = await supabase.from("moas").select("*").order("created_at", { ascending: false });
    if (data) setMoas(mapMoaData(data));
    setLoading(false);
  };

  useEffect(() => {
    fetchMoas();
    const channel = supabase.channel("public:moas")
      .on("postgres_changes", { event: "*", schema: "public", table: "moas" }, () => fetchMoas())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Reset to page 1 whenever a filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterIndustry, filterStatus]);

  // Action Triggers (Opens Modal instead of native confirm/alert)
  const requestDelete = (moaId: string, companyName: string) => {
    setOpenDropdownId(null);
    setConfirmDialog({ isOpen: true, type: "delete", moaId, companyName, isLoading: false, error: "" });
  };

  const requestRecover = (moaId: string, companyName: string) => {
    setOpenDropdownId(null);
    setConfirmDialog({ isOpen: true, type: "recover", moaId, companyName, isLoading: false, error: "" });
  };

  // The actual database execution
  const executeAction = async () => {
    const { type, moaId, companyName } = confirmDialog;
    setConfirmDialog(prev => ({ ...prev, isLoading: true, error: "" }));

    try {
      if (type === "delete") {
        await supabase.from("moas").update({ is_deleted: true }).eq("id", moaId);
        await supabase.from("audit_logs").insert([{ moa_id: moaId, company_name: companyName, user_email: user?.email, action: "SOFT_DELETE" }]);
      } else if (type === "recover") {
        await supabase.from("moas").update({ is_deleted: false }).eq("id", moaId);
        await supabase.from("audit_logs").insert([{ moa_id: moaId, company_name: companyName, user_email: user?.email, action: "RECOVER" }]);
      }
      
      // Close modal on success
      setConfirmDialog({ isOpen: false, type: null, moaId: "", companyName: "", isLoading: false, error: "" });
    } catch (error) {
      setConfirmDialog(prev => ({ ...prev, isLoading: false, error: `Failed to ${type} MOA. Please try again.` }));
    }
  };

  if (loading) return <div className="mt-8 p-8 text-center text-gray-500 bg-white dark:bg-gray-800 animate-pulse rounded-lg">Loading MOA data...</div>;

  // Filtering Logic
  let filteredMoas = role === "admin" ? moas : moas.filter(moa => !moa.isDeleted);
  filteredMoas = filteredMoas.filter((moa) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      moa.hteId?.toLowerCase().includes(searchLower) ||
      moa.companyName?.toLowerCase().includes(searchLower) ||
      moa.contactPerson?.toLowerCase().includes(searchLower) ||
      moa.address?.toLowerCase().includes(searchLower);
      
    const matchesCollege = filterCollege === "" || moa.endorsedBy === filterCollege;
    const matchesIndustry = filterIndustry === "" || moa.industry === filterIndustry;
    const matchesStatus = filterStatus === "" || moa.status?.includes(filterStatus);
    const matchesStart = startDate === "" || (moa.effectiveDate && moa.effectiveDate >= startDate);
    const matchesEnd = endDate === "" || (moa.effectiveDate && moa.effectiveDate <= endDate);
    
    return matchesSearch && matchesCollege && matchesIndustry && matchesStatus && matchesStart && matchesEnd;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredMoas.length / rowsPerPage) || 1;
  const paginatedMoas = filteredMoas.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 mt-6 flex flex-col transition-colors">
      
      <div className="overflow-x-auto lg:overflow-visible">
        <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
          <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              {role !== "student" && <th className="px-4 py-3">HTE ID</th>}
              <th className="px-4 py-3">Company Info</th>
              <th className="px-4 py-3">Contact Person</th>
              {role !== "student" && (
                <>
                  <th className="px-4 py-3">Industry / College</th>
                  <th className="px-4 py-3">Dates & Status</th>
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
            {paginatedMoas.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">No MOAs found matching your criteria.</td>
              </tr>
            ) : (
              paginatedMoas.map((moa) => (
                <tr 
                  key={moa.id} 
                  className={`border-b border-gray-100 dark:border-gray-800 transition-colors ${
                    moa.isDeleted 
                      ? "bg-red-50/50 dark:bg-red-900/10 opacity-60 grayscale-[30%]" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  {role !== "student" && (
                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {moa.isDeleted && <span className="text-red-600 font-bold mr-2 text-xs border border-red-600 px-1 rounded">DELETED</span>}
                      {moa.hteId || "N/A"}
                    </td>
                  )}
                  <td className="px-4 py-4">
                    <p className={`font-semibold text-gray-800 dark:text-gray-100 ${moa.isDeleted ? 'line-through' : ''}`}>{moa.companyName}</p>
                    <p className="text-xs text-gray-500">{moa.address}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-gray-800 dark:text-gray-200">{moa.contactPerson}</p>
                    <p className="text-xs text-gray-500">{moa.email}</p>
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
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 space-y-0.5">
                          <p>Eff: {moa.effectiveDate}</p>
                          {moa.expirationDate && <p>Exp: {moa.expirationDate}</p>}
                        </div>
                      </td>
                    </>
                  )}

                  {role === "admin" && (
                    <>
                      <td className="px-4 py-4 text-xs">
                        <button 
                          onClick={() => {
                            setAuditModalMoaId(moa.id);
                            setAuditModalCompanyName(moa.companyName);
                          }}
                          className="text-neu-primary hover:text-neu-secondary dark:text-neu-light font-medium underline underline-offset-2 transition"
                        >
                          View History
                        </button>
                      </td>
                      <td className="px-4 py-4 text-right whitespace-nowrap relative">
                        {moa.isDeleted ? (
                          <button onClick={() => requestRecover(moa.id, moa.companyName)} className="text-green-600 dark:text-green-400 hover:text-green-800 font-bold text-xs bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded border border-green-200 dark:border-green-800 transition">
                            Recover Data
                          </button>
                        ) : (
                          <div>
                            <button 
                              onClick={() => setOpenDropdownId(openDropdownId === moa.id ? null : moa.id)}
                              className="p-1.5 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                              </svg>
                            </button>

                            {openDropdownId === moa.id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)}></div>
                                
                                <div className="absolute right-10 top-10 w-32 bg-white dark:bg-gray-800 rounded-md shadow-xl py-1 border border-gray-200 dark:border-gray-700 z-50 text-left">
                                  <button 
                                    onClick={() => { setOpenDropdownId(null); setSelectedMoa(moa); setIsEditModalOpen(true); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    Edit MOA
                                  </button>
                                  <button 
                                    onClick={() => requestDelete(moa.id, moa.companyName)}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{((currentPage - 1) * rowsPerPage) + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(currentPage * rowsPerPage, filteredMoas.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{filteredMoas.length}</span> Entries
          </span>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 transition-opacity">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-700 text-center">
            
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
              confirmDialog.type === "delete" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            }`}>
              {confirmDialog.type === "delete" ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {confirmDialog.type === "delete" ? "Delete MOA Record?" : "Recover MOA Record?"}
            </h3>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {confirmDialog.type === "delete" 
                ? `Are you sure you want to softly delete the record for ${confirmDialog.companyName}? The data will be hidden but can be recovered later.`
                : `Are you sure you want to restore the record for ${confirmDialog.companyName}? It will become visible in the active table again.`}
            </p>

            {confirmDialog.error && (
              <div className="bg-red-50 text-red-600 text-sm p-2 rounded mb-4">{confirmDialog.error}</div>
            )}

            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setConfirmDialog({ isOpen: false, type: null, moaId: "", companyName: "", isLoading: false, error: "" })}
                disabled={confirmDialog.isLoading}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={executeAction}
                disabled={confirmDialog.isLoading}
                className={`px-4 py-2 text-white rounded-md transition disabled:opacity-50 font-medium ${
                  confirmDialog.type === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {confirmDialog.isLoading ? "Processing..." : confirmDialog.type === "delete" ? "Yes, Delete" : "Yes, Recover"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other Modals */}
      {isEditModalOpen && selectedMoa && (
        <EditMoaModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedMoa(null); }} moaData={selectedMoa} />
      )}
      <AuditTrailModal isOpen={!!auditModalMoaId} onClose={() => setAuditModalMoaId(null)} moaId={auditModalMoaId || ""} companyName={auditModalCompanyName} />
    </div>
  );
}