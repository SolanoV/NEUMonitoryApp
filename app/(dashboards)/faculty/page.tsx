"use client";

import { useState } from "react";
import StatCards from "@/components/StatCards";
import SearchBar from "@/components/SearchBar";
import MoaTable from "@/components/MoaTable";
import FilterSidebar from "@/components/FilterSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";

export default function FacultyDashboard() {
  const { role } = useAuth();
  
  // Lifted States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCollege, setFilterCollege] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filterProps = { filterCollege, filterIndustry, filterStatus, startDate, endDate };

  return (
    <ProtectedRoute allowedRoles={["faculty"]}>
      <div className="space-y-6 w-full px-4 sm:px-8 max-w-none mx-auto transition-colors duration-300 pb-12 mt-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">Faculty Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Monitor university MOAs and partner statuses.</p>
        </div>
        
        {/* Master Layout Split */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT SIDE: Content Container (75%) */}
          <div className="w-full lg:w-3/4 order-2 lg:order-1 space-y-6">
            <StatCards {...filterProps} />
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <MoaTable searchTerm={searchTerm} {...filterProps} />
          </div>

          {/* RIGHT SIDE: Sidebar Container (25%) */}
          <div className="w-full lg:w-1/4 order-1 lg:order-2 sticky top-6">
            <FilterSidebar 
              role={role}
              filterCollege={filterCollege} setFilterCollege={setFilterCollege}
              filterIndustry={filterIndustry} setFilterIndustry={setFilterIndustry}
              filterStatus={filterStatus} setFilterStatus={setFilterStatus}
              startDate={startDate} setStartDate={setStartDate}
              endDate={endDate} setEndDate={setEndDate}
            />
          </div>

        </div>

      </div>
    </ProtectedRoute>
  );
}