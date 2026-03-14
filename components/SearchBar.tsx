"use client";

import React from "react";

interface SearchBarProps {
  onSearchChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function SearchBar({ onSearchChange, onIndustryChange, onStatusChange }: SearchBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        
        {/* Main Text Search Bar */}
        <div className="relative w-full md:flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 14 0Z"/>
            </svg>
          </div>
          <input 
            type="search" 
            onChange={(e) => onSearchChange(e.target.value)} // Updates instantly as you type!
            className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-neu-primary focus:border-neu-primary focus:outline-none" 
            placeholder="Search company, contact person, or address..." 
          />
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          
          <select 
            onChange={(e) => onIndustryChange(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-neu-primary focus:border-neu-primary block w-full p-3 focus:outline-none"
          >
            <option value="">All Industries</option>
            <option value="Technology">Technology</option>
            <option value="Food">Food</option>
            <option value="Services">Services</option>
            <option value="Telecom">Telecom</option>
            <option value="Finance">Finance</option>
          </select>

          <select 
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-neu-primary focus:border-neu-primary block w-full p-3 focus:outline-none"
          >
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