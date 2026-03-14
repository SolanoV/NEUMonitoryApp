
"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import EditMoaModal from "@/components/EditMoaModal";


// Define the shape of our MOA data
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

  useEffect(() => {
    // Listen to the "moas" collection in real-time
    const q = query(collection(db, "moas")); // Later we will add orderBy("createdAt", "desc")
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const moaData: Moa[] = [];
      snapshot.forEach((doc) => {
        moaData.push({ id: doc.id, ...doc.data() } as Moa);
      });
      setMoas(moaData);
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Function to Soft Delete an MOA
  const handleSoftDelete = async (moaId: string, companyName: string) => {
    if (!window.confirm(`Are you sure you want to delete the MOA for ${companyName}?`)) return;
    
    try {
      // 1. Update the MOA document
      const moaRef = doc(db, "moas", moaId);
      await updateDoc(moaRef, {
        isDeleted: true,
        auditTrail: `Deleted by ${user?.email} on ${new Date().toLocaleDateString()}`
      });

      // 2. Add an Audit Log
      await addDoc(collection(db, "audit_logs"), {
        moaId: moaId,
        companyName: companyName,
        userEmail: user?.email,
        action: "SOFT_DELETE",
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error deleting MOA:", error);
      alert("Failed to delete MOA.");
    }
  };

  // Function to Recover a deleted MOA
  const handleRecover = async (moaId: string, companyName: string) => {
    if (!window.confirm(`Are you sure you want to recover the MOA for ${companyName}?`)) return;

    try {
      // 1. Update the MOA document
      const moaRef = doc(db, "moas", moaId);
      await updateDoc(moaRef, {
        isDeleted: false,
        auditTrail: `Recovered by ${user?.email} on ${new Date().toLocaleDateString()}`
      });

      // 2. Add an Audit Log
      await addDoc(collection(db, "audit_logs"), {
        moaId: moaId,
        companyName: companyName,
        userEmail: user?.email,
        action: "RECOVER",
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error recovering MOA:", error);
      alert("Failed to recover MOA.");
    }
  };

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

  // Filter out deleted rows for Faculty and Students (Admin sees everything)
  let filteredMoas = role === "admin" ? moas : moas.filter(moa => !moa.isDeleted);

  // 2. Apply Search and Dropdown Filters
  filteredMoas = filteredMoas.filter((moa) => {
    // Check text search (matches Company, Contact, or Address)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      moa.hteId?.toLowerCase().includes(searchLower) ||          // <-- ADDED THIS LINE
      moa.companyName?.toLowerCase().includes(searchLower) ||
      moa.contactPerson?.toLowerCase().includes(searchLower) ||
      moa.address?.toLowerCase().includes(searchLower);

    // Check dropdowns
    const matchesIndustry = filterIndustry === "" || moa.industry === filterIndustry;
    const matchesStatus = filterStatus === "" || moa.status?.includes(filterStatus);

    return matchesSearch && matchesIndustry && matchesStatus;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              {/* Columns visible to Admin and Faculty */}
              {role !== "student" && <th className="px-4 py-3">HTE ID</th>}
              
              {/* Columns visible to EVERYONE */}
              <th className="px-4 py-3">Company Info</th>
              <th className="px-4 py-3">Contact Person</th>
              
              {/* Columns visible to Admin and Faculty */}
              {role !== "student" && (
                <>
                  <th className="px-4 py-3">Industry / College</th>
                  <th className="px-4 py-3">Status / Date</th>
                </>
              )}

              {/* Columns visible ONLY to Admin */}
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
                className={`border-b border-gray-100 transition ${moa.isDeleted ? "bg-red-50 opacity-75" : "hover:bg-gray-50"}`}
              >
                {role !== "student" && (
                  <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {moa.hteId || "N/A"}
                  </td>
                )}
                <td className="px-4 py-4">
                  <p className="font-semibold text-gray-800">{moa.companyName}</p>
                  <p className="text-xs text-gray-500">{moa.address}</p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-gray-800">{moa.contactPerson}</p>
                  <p className="text-xs text-gray-500">{moa.email}</p>
                </td>
                
                {role !== "student" && (
                  <>
                    <td className="px-4 py-4">
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-300">
                        {moa.industry || "Unknown"}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Endorsed: {moa.endorsedBy}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded border ${
                        moa.status?.includes("APPROVED") ? "bg-neu-light text-neu-black border-neu-secondary" : 
                        moa.status?.includes("PROCESSING") ? "bg-yellow-100 text-yellow-800 border-yellow-300" : 
                        "bg-red-100 text-red-800 border-red-300"
                      }`}>
                        {moa.status || "Unknown"}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Effective: {moa.effectiveDate}</p>
                    </td>
                  </>
                )}

                {role === "admin" && (
                  <>
                    <td className="px-4 py-4 text-xs italic text-gray-500 max-w-xs truncate">
                      {moa.auditTrail || "No trail"}
                      {moa.isDeleted && <span className="block text-red-600 font-bold mt-1">(DELETED)</span>}
                    </td>
                    <td className="px-4 py-4 text-right space-x-2 whitespace-nowrap">
                        {!moa.isDeleted ? (
                            <>
                                <button 
                                    onClick={() => {
                                    setSelectedMoa(moa);
                                    setIsEditModalOpen(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-900 font-medium text-xs transition"
                                >
                                    Edit
                                </button>
                                <button 
                                onClick={() => handleSoftDelete(moa.id, moa.companyName)}
                                className="text-red-600 hover:text-red-900 font-medium text-xs transition"
                                >
                                Delete
                                </button>
                            </>
                        ) : (
                                <button 
                                onClick={() => handleRecover(moa.id, moa.companyName)}
                                className="text-green-600 hover:text-green-900 font-medium text-xs transition"
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