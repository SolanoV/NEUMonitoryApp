// components/StatCards.tsx
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface StatCardsProps {
  filterCollege: string;
  filterIndustry: string;
  filterStatus: string;
  startDate: string;
  endDate: string;
}

export default function StatCards({ filterCollege, filterIndustry, filterStatus, startDate, endDate }: StatCardsProps) {
  const [activeCount, setActiveCount] = useState(0);
  const [processingCount, setProcessingCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      let query = supabase.from("moas").select("status").eq("is_deleted", false);

      // Filters applied to the database count
      if (filterCollege) query = query.eq("endorsed_by", filterCollege);
      if (filterIndustry) query = query.eq("industry", filterIndustry);
      if (filterStatus) query = query.ilike("status", `%${filterStatus}%`);
      if (startDate) query = query.gte("effective_date", startDate);
      if (endDate) query = query.lte("effective_date", endDate);

      const { data, error } = await query;

      if (data && !error) {
        let active = 0; let processing = 0; let expired = 0;

        data.forEach((row) => {
          const status = row.status || "";
          if (status.includes("APPROVED")) active++;
          else if (status.includes("PROCESSING")) processing++;
          else if (status.includes("EXPIRED") || status.includes("EXPIRING")) expired++;
        });

        setActiveCount(active);
        setProcessingCount(processing);
        setExpiredCount(expired);
      }
    };

    fetchStats();
  }, [filterCollege, filterIndustry, filterStatus, startDate, endDate, refreshTrigger]);

  useEffect(() => {
    const channel = supabase.channel("public:moas-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "moas" }, () => {
        setRefreshTrigger((prev) => prev + 1);
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-neu-primary text-white rounded-xl p-6 shadow-md flex flex-col items-center justify-center transition hover:scale-105">
        <h3 className="text-lg font-medium opacity-90">Active MOAs</h3>
        <p className="text-4xl font-bold mt-2">{activeCount}</p>
      </div>
      
      <div className="bg-neu-secondary text-white rounded-xl p-6 shadow-md flex flex-col items-center justify-center transition hover:scale-105">
        <h3 className="text-lg font-medium opacity-90">Under Processing</h3>
        <p className="text-4xl font-bold mt-2">{processingCount}</p>
      </div>
      
      <div className="bg-neu-light dark:bg-gray-800 text-neu-black dark:text-gray-100 rounded-xl p-6 shadow-md border border-neu-secondary dark:border-gray-700 flex flex-col items-center justify-center transition hover:scale-105">
        <h3 className="text-lg font-medium opacity-90">Expired / Expiring</h3>
        <p className="text-4xl font-bold mt-2">{expiredCount}</p>
      </div>
    </div>
  );
}