// components/EditMoaModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

interface EditMoaModalProps {
  isOpen: boolean;
  onClose: () => void;
  moaData: any; // The existing data of the MOA we clicked on
}

export default function EditMoaModal({ isOpen, onClose, moaData }: EditMoaModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(moaData || {});

  useEffect(() => {
    if (moaData) {
      setFormData(moaData);
    }
  }, [moaData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.id) return;
    setIsLoading(true);

    try {
      // 1. Update the actual MOA document
      const { error: updateError } = await supabase
        .from("moas")
        .update({
          hte_id: formData.hteId,
          company_name: formData.companyName,
          address: formData.address,
          contact_person: formData.contactPerson,
          email: formData.email,
          industry: formData.industry,
          effective_date: formData.effectiveDate || null,
          status: formData.status,
          endorsed_by: formData.endorsedBy,
          audit_trail: `Edited by ${user.email} on ${new Date().toLocaleDateString()}`,
          updated_at: new Date().toISOString()
        })
        .eq("id", formData.id);

      if (updateError) throw updateError;

      // 2. Save the official Audit Log
      const { error: auditError } = await supabase
        .from("audit_logs")
        .insert([{
          moa_id: formData.id,
          company_name: formData.companyName,
          user_email: user.email,
          action: "UPDATE",
        }]);

      if (auditError) throw auditError;

      // Success! Close modal
      onClose();
    } catch (error) {
      console.error("Error updating MOA: ", error);
      alert("Failed to update MOA. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !moaData) return null;

  // Render remains exactly the same...
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800">Edit MOA: {formData.companyName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition text-2xl font-semibold">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HTE ID</label>
                <input required type="text" name="hteId" value={formData.hteId || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input required type="text" name="companyName" value={formData.companyName || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input required type="text" name="address" value={formData.address || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endorsing College</label>
                <input required type="text" name="endorsedBy" value={formData.endorsedBy || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input required type="text" name="contactPerson" value={formData.contactPerson || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input required type="email" name="email" value={formData.email || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                <input required type="date" name="effectiveDate" value={formData.effectiveDate || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select name="industry" value={formData.industry || "Technology"} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
                  <option value="Technology">Technology</option>
                  <option value="Food">Food</option>
                  <option value="Services">Services</option>
                  <option value="Telecom">Telecom</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status of MOA</label>
            <select name="status" value={formData.status || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2">
              <option value="APPROVED: Signed by President">APPROVED: Signed by President</option>
              <option value="APPROVED: On-going notarization">APPROVED: On-going notarization</option>
              <option value="APPROVED: No notarization needed">APPROVED: No notarization needed</option>
              <option value="PROCESSING: Awaiting signature of the MOA draft by HTE partner.">PROCESSING: Awaiting signature of the MOA draft by HTE partner.</option>
              <option value="PROCESSING: MOA draft sent to Legal Office for Review">PROCESSING: MOA draft sent to Legal Office for Review</option>
              <option value="PROCESSING: MOA draft and opinion of legal office sent to VPAA/OP for approval.">PROCESSING: MOA draft and opinion of legal office sent to VPAA/OP for approval.</option>
              <option value="EXPIRING: Two months before the expiration date.">EXPIRING: Two months before the expiration date.</option>
              <option value="EXPIRED: No renewal done.">EXPIRED: No renewal done.</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition disabled:opacity-50">
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}