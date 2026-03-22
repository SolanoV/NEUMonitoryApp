"use client";

import { useState } from "react";
import StatCards from "@/components/StatCards";
import SearchBar from "@/components/SearchBar";
import MoaTable from "@/components/MoaTable";
import ProtectedRoute from "@/components/ProtectedRoute";
import AddMoaModal from "@/components/AddMoaModal"; 

export default function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6 transition-colors duration-300">
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

        <AddMoaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </ProtectedRoute>
  );
}