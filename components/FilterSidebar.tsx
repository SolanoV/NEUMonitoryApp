"use client";

import React from "react";

interface FilterSidebarProps {
  role: string | null;
  filterCollege: string;
  setFilterCollege: (val: string) => void;
  filterIndustry: string;
  setFilterIndustry: (val: string) => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
}

export default function FilterSidebar({ role, filterCollege, setFilterCollege, filterIndustry, setFilterIndustry, filterStatus, setFilterStatus, startDate, setStartDate, endDate, setEndDate }: FilterSidebarProps) {
  const inputClass = "w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neu-secondary bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors";

  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 space-y-6">
      <h3 className="font-bold text-gray-800 dark:text-white text-lg border-b border-gray-100 dark:border-gray-800 pb-2">Filters</h3>
      
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase">College</label>
        <select value={filterCollege} onChange={(e) => setFilterCollege(e.target.value)} className={inputClass}>
          <option value="">All Colleges</option>
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

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase">Industry</label>
        <select value={filterIndustry} onChange={(e) => setFilterIndustry(e.target.value)} className={inputClass}>
          <option value="">All Industries</option>
          <option value="Technology">Technology</option>
          <option value="Food">Food</option>
          <option value="Services">Services</option>
          <option value="Telecom">Telecom</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      {role !== "student" && (
        <>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={inputClass}>
              <option value="">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PROCESSING">Processing</option>
              <option value="EXPIRING">Expiring Soon</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase">Effective Date Range</label>
            <div className="flex flex-col gap-2">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} placeholder="Start" />
              <div className="text-center text-xs text-gray-400">to</div>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} placeholder="End" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}