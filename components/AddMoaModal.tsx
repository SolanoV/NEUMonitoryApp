"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

interface AddMoaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMoaModal({ isOpen, onClose }: AddMoaModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "", address: "", contactPerson: "",
    email: "", industry: "Technology", effectiveDate: "", 
    expirationDate: "",
    status: "PROCESSING: Awaiting signature of the MOA draft by HTE partner.", endorsedBy: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    const generatedHteId = `HTE-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    try {
      const { data: moaData, error: moaError } = await supabase
        .from("moas")
        .insert([{
          hte_id: generatedHteId,
          company_name: formData.companyName,
          address: formData.address,
          contact_person: formData.contactPerson,
          email: formData.email,
          industry: formData.industry,
          effective_date: formData.effectiveDate || null,
          expiration_date: formData.expirationDate || null,
          status: formData.status,
          endorsed_by: formData.endorsedBy,
          is_deleted: false,
          audit_trail: `Added by ${user.email} on ${new Date().toLocaleDateString()}`
        }])
        .select()
        .single();

      if (moaError) throw moaError;

      const { error: auditError } = await supabase.from("audit_logs").insert([{
          moa_id: moaData.id,
          company_name: formData.companyName,
          user_email: user.email,
          action: "INSERT",
      }]);

      if (auditError) throw auditError;

      onClose();
      setFormData({
        companyName: "", address: "", contactPerson: "", email: "", industry: "Technology", effectiveDate: "", expirationDate: "", status: "PROCESSING: Awaiting signature of the MOA draft by HTE partner.", endorsedBy: ""
      });
    } catch (error) {
      console.error("Error adding MOA: ", error);
      alert("Failed to add MOA. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClassName = "w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-neu-primary focus:border-neu-primary transition-colors";

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 transition-opacity">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add New MOA</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition text-2xl font-semibold">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={inputClassName} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <input required type="text" name="address" value={formData.address} onChange={handleChange} className={inputClassName} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endorsing College</label>
                <select required name="endorsedBy" value={formData.endorsedBy} onChange={handleChange} className={inputClassName}>
                  <option value="" disabled>Select a College</option>
                  <option value="College of Informatics and Computing Studies">College of Informatics and Computing Studies</option>
                  <option value="College of Accountancy">College of Accountancy</option>
                  <option value="College of Business Administration">College of Business Administration</option>
                  <option value="College of Communication">College of Communication</option>
                  <option value="College of Midwifery">College of Midwifery</option>
                  <option value="College of Nursing">College of Nursing</option>
                  <option value="College of Law">College of Law</option>
                  <option value="College of Criminology">College of Criminology</option>
                  <option value="College of Agriculture">College of Agriculture</option>
                  <option value="College of Medical Technology">College of Medical Technology</option>
                  <option value="College of Engineering and Architecture">College of Engineering and Architecture</option>
                  <option value="College of Arts and Sciences">College of Arts and Sciences</option>
                  <option value="College of Medicine">College of Medicine</option>
                  <option value="College of Music">College of Music</option>
                  <option value="College of Respiratory Therapy">College of Respiratory Therapy</option>
                  <option value="College of Physical Therapy">College of Physical Therapy</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Person</label>
                <input required type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className={inputClassName} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClassName} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                <select name="industry" value={formData.industry} onChange={handleChange} className={inputClassName}>
                  <option value="Technology">Technology</option>
                  <option value="Food">Food</option>
                  <option value="Services">Services</option>
                  <option value="Telecom">Telecom</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>
          </div>

          {/* NEW: Dedicated Full-Width Row for Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Effective Date</label>
              <input required type="date" name="effectiveDate" value={formData.effectiveDate} onChange={handleChange} className={inputClassName} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exp. Date <span className="text-gray-400 text-xs">(Opt)</span></label>
              <input type="date" name="expirationDate" value={formData.expirationDate} onChange={handleChange} className={inputClassName} />
            </div>
          </div>

          {/* Full-Width Row for Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status of MOA</label>
            <select name="status" value={formData.status} onChange={handleChange} className={inputClassName}>
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

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-white bg-neu-primary hover:bg-neu-secondary rounded-md transition disabled:opacity-50">
              {isLoading ? "Saving..." : "Save MOA"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}