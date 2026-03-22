// components/StatCards.tsx
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StatCards() {
  const [activeCount, setActiveCount] = useState(0);
  const [processingCount, setProcessingCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);

  const fetchStats = async () => {
    // We only want to count MOAs that haven't been soft-deleted
    const { data } = await supabase
      .from("moas")
      .select("status")
      .eq("is_deleted", false);

    if (data) {
      let active = 0;
      let processing = 0;
      let expired = 0;

      data.forEach((row) => {
        const status = row.status || "";
        
        if (status.includes("APPROVED")) {
          active++;
        } else if (status.includes("PROCESSING")) {
          processing++;
        } else if (status.includes("EXPIRED") || status.includes("EXPIRING")) {
          expired++;
        }
      });

      setActiveCount(active);
      setProcessingCount(processing);
      setExpiredCount(expired);
    }
  };

  useEffect(() => {
    fetchStats();

    // Re-fetch when the DB updates
    const channel = supabase
      .channel("public:moas-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "moas" }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // UI remains identical...
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Dashboard Overview</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neu-secondary bg-white text-gray-700">
            <option value="">All Colleges</option>
            <option value="CCS">College of Computer Studies</option>
            <option value="CBA">College of Business Administration</option>
            <option value="COE">College of Engineering</option>
          </select>

          <div className="flex items-center gap-2">
            <input 
              type="date" 
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neu-secondary text-gray-700"
            />
            <span className="text-gray-500 text-sm">to</span>
            <input 
              type="date" 
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neu-secondary text-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neu-primary text-white rounded-xl p-6 shadow-md flex flex-col items-center justify-center transition hover:scale-105">
          <h3 className="text-lg font-medium opacity-90">Active MOAs</h3>
          <p className="text-4xl font-bold mt-2">{activeCount}</p>
        </div>
        
        <div className="bg-neu-secondary text-white rounded-xl p-6 shadow-md flex flex-col items-center justify-center transition hover:scale-105">
          <h3 className="text-lg font-medium opacity-90">Under Processing</h3>
          <p className="text-4xl font-bold mt-2">{processingCount}</p>
        </div>
        
        <div className="bg-neu-light text-neu-black rounded-xl p-6 shadow-md flex flex-col items-center justify-center border border-neu-secondary transition hover:scale-105">
          <h3 className="text-lg font-medium opacity-90">Expired / Expiring</h3>
          <p className="text-4xl font-bold mt-2">{expiredCount}</p>
        </div>
      </div>
    </div>
  );
}