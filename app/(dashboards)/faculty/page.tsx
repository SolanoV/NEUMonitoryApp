"use client";

import { useState } from "react";
import StatCards from "@/components/StatCards";
import SearchBar from "@/components/SearchBar";
import MoaTable from "@/components/MoaTable";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function FacultyDashboard() {
  // State to hold our search and filter values
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  return (
    <ProtectedRoute allowedRoles={["faculty"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Faculty Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor university MOAs and partner statuses.</p>
        </div>
        
        {/* Statistics Section */}
        <StatCards />
        
        {/* Search & Filter Section */}
        <SearchBar 
          onSearchChange={setSearchTerm} 
          onIndustryChange={setFilterIndustry} 
          onStatusChange={setFilterStatus} 
        />

        {/* Main Data Table */}
        <MoaTable 
          searchTerm={searchTerm} 
          filterIndustry={filterIndustry} 
          filterStatus={filterStatus} 
        />
      </div>
    </ProtectedRoute>
  );
}