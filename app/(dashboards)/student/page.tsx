"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import MoaTable from "@/components/MoaTable";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function StudentDashboard() {
  // State to hold our search values
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Portal</h1>
          <p className="text-gray-500 mt-1">Search for approved Host Training Establishments (HTE) for your OJT.</p>
        </div>
        
        {/* Search & Filter Section */}
        <SearchBar 
          onSearchChange={setSearchTerm} 
          onIndustryChange={setFilterIndustry} 
          onStatusChange={setFilterStatus} 
        />

        {/* Main Data Table */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-neu-light">
          <h2 className="text-lg font-semibold text-neu-primary mb-4">Available Partner Companies</h2>
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