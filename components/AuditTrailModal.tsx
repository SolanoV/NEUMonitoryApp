// components/AuditTrailModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface AuditLog {
  id: string;
  user_email: string;
  action: string;
  timestamp: string;
}

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  moaId: string;
  companyName: string;
}

export default function AuditTrailModal({ isOpen, onClose, moaId, companyName }: AuditTrailModalProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && moaId) {
      setLoading(true);
      supabase
        .from("audit_logs")
        .select("*")
        .eq("moa_id", moaId)
        .order("timestamp", { ascending: false })
        .then(({ data }) => {
          if (data) setLogs(data);
          setLoading(false);
        });
    }
  }, [isOpen, moaId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xl max-h-[80vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
        
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Audit Trail</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{companyName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-2xl font-bold transition">&times;</button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-900/20">
          {loading ? (
            <div className="animate-pulse text-center text-neu-primary">Loading records...</div>
          ) : logs.length === 0 ? (
            <div className="text-center text-gray-500 text-sm">No audit history found.</div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      log.action === "INSERT" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      log.action === "UPDATE" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      log.action === "RECOVER" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Executed by: <span className="font-semibold">{log.user_email}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}