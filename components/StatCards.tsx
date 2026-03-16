// components/StatCards.tsx
"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StatCards() {
  const [activeCount, setActiveCount] = useState(0);
  const [processingCount, setProcessingCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);

  useEffect(() => {
    // We only want to count MOAs that haven't been soft-deleted
    const q = query(collection(db, "moas"), where("isDeleted", "==", false));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let active = 0;
      let processing = 0;
      let expired = 0;

      snapshot.forEach((doc) => {
        const status = doc.data().status || "";
        
        // Categorize based on keywords in your status list
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
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      {/* Filters Area (UI Only for now) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Dashboard Overview</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* College Filter */}
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neu-secondary bg-white text-gray-700">
            <option value="">All Colleges</option>
            <option value="CCS">College of Computer Studies</option>
            <option value="CBA">College of Business Administration</option>
            <option value="COE">College of Engineering</option>
          </select>

          {/* Date Period Filter */}
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

      {/* Cards Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Card */}
        <div className="bg-neu-primary text-white rounded-xl p-6 shadow-md flex flex-col items-center justify-center transition hover:scale-105">
          <h3 className="text-lg font-medium opacity-90">Active MOAs</h3>
          <p className="text-4xl font-bold mt-2">{activeCount}</p>
        </div>
        
        {/* Processing Card */}
        <div className="bg-neu-secondary text-white rounded-xl p-6 shadow-md flex flex-col items-center justify-center transition hover:scale-105">
          <h3 className="text-lg font-medium opacity-90">Under Processing</h3>
          <p className="text-4xl font-bold mt-2">{processingCount}</p>
        </div>
        
        {/* Expired Card */}
        <div className="bg-neu-light text-neu-black rounded-xl p-6 shadow-md flex flex-col items-center justify-center border border-neu-secondary transition hover:scale-105">
          <h3 className="text-lg font-medium opacity-90">Expired / Expiring</h3>
          <p className="text-4xl font-bold mt-2">{expiredCount}</p>
        </div>
      </div>
    </div>
  );
}