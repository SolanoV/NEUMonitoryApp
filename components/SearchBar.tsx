"use client";

import React from "react";

interface SearchBarProps {
  onSearchChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function SearchBar({ onSearchChange, onIndustryChange, onStatusChange }: SearchBarProps) {
  const inputClass = "bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-neu-primary focus:border-neu-primary block w-full p-3 focus:outline-none transition-colors";

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 mt-6 transition-colors">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input
            type="search"
            onChange={(e) => onSearchChange(e.target.value)}
            className={`${inputClass} pl-10`}
            placeholder="Search company, contact person, or address..."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select onChange={(e) => onIndustryChange(e.target.value)} className={inputClass}>
            <option value="">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Food">Food</option>
            <option value="Services">Services</option>
            <option value="Telecom">Telecom</option>
            <option value="Finance">Finance</option>
          </select>

          <select onChange={(e) => onStatusChange(e.target.value)} className={inputClass}>
            <option value="">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PROCESSING">Processing</option>
            <option value="EXPIRING">Expiring Soon</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>
    </div>
  );
}