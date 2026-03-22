"use client";

import { useState } from "react";
import StatCards from "@/components/StatCards";
import SearchBar from "@/components/SearchBar";
import MoaTable from "@/components/MoaTable";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function FacultyDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  return (
    <ProtectedRoute allowedRoles={["faculty"]}>
      <div className="space-y-6 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">Faculty Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Monitor university MOAs and partner statuses.</p>
        </div>
        
        <StatCards />
        
        <SearchBar 
          onSearchChange={setSearchTerm} 
          onIndustryChange={setFilterIndustry} 
          onStatusChange={setFilterStatus} 
        />

        <MoaTable 
          searchTerm={searchTerm} 
          filterIndustry={filterIndustry} 
          filterStatus={filterStatus} 
        />
      </div>
    </ProtectedRoute>
  );
}