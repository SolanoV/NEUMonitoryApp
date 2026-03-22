"use client";

import { useState } from "react";
import StatCards from "@/components/StatCards";
import SearchBar from "@/components/SearchBar";
import MoaTable from "@/components/MoaTable";
import FilterSidebar from "@/components/FilterSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import AddMoaModal from "@/components/AddMoaModal"; 
import { useAuth } from "@/components/AuthProvider";

export default function AdminDashboard() {
  const { role } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false); 
  
  // Lifted States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCollege, setFilterCollege] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filterProps = { filterCollege, filterIndustry, filterStatus, startDate, endDate };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      {/* 1. Widened the max-w and added responsive padding */}
      <div className="space-y-6 w-full px-4 sm:px-8 max-w-none mx-auto transition-colors duration-300 pb-12 mt-6">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Manage and monitor university MOAs.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-neu-primary hover:bg-neu-secondary text-white font-medium py-2 px-6 rounded-lg transition shadow-sm flex items-center gap-2"
          >
            <span className="text-xl leading-none">+</span> Add New MOA
          </button>
        </div>

        {/* Master Layout Split */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT SIDE: Content Container (Now 80% instead of 75%) */}
          <div className="w-full lg:w-4/5 order-2 lg:order-1 space-y-6">
            <StatCards {...filterProps} />
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <MoaTable searchTerm={searchTerm} {...filterProps} />
          </div>
          
          {/* RIGHT SIDE: Sidebar Container (Now 20% instead of 25%) */}
          <div className="w-full lg:w-1/5 order-1 lg:order-2 sticky top-6">
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

        {/* Hidden Modal */}
        <AddMoaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </ProtectedRoute>
  );
}