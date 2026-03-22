"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import MoaTable from "@/components/MoaTable";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function StudentDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="space-y-6 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">Student Portal</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Search for approved Host Training Establishments (HTE) for your OJT.</p>
        </div>
        
        <SearchBar 
          onSearchChange={setSearchTerm} 
          onIndustryChange={setFilterIndustry} 
          onStatusChange={setFilterStatus} 
        />

        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-neu-light dark:border-gray-800 transition-colors">
          <h2 className="text-lg font-semibold text-neu-primary dark:text-neu-light mb-4">Available Partner Companies</h2>
          <MoaTable 
            searchTerm={searchTerm} 
            filterIndustry={filterIndustry} 
            filterStatus={filterStatus} 
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}