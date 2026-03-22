"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const { user, role, loading } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 transition-colors duration-300">
      
      {/* Hero Section */}
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">
          NEU <span className="text-neu-primary">MOA Monitoring</span> Portal
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed transition-colors">
          A centralized platform for managing, tracking, and exploring Host Training Establishments (HTE) for New Era University students and faculty.
        </p>
      </div>

      {/* Smart Call-to-Action (CTA) Area */}
      <div className="mt-10">
        {loading ? (
          <div className="animate-pulse text-neu-primary font-semibold">
            Loading your portal...
          </div>
        ) : !user ? (
          // Logged Out State
          <Link 
            href="/login" 
            className="inline-block bg-neu-primary hover:bg-neu-secondary text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transition transform hover:-translate-y-1"
          >
            Get Started (Login)
          </Link>
        ) : (
          // Logged In State
          <div className="space-y-4">
            <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors">
              Welcome back, <span className="text-gray-800 dark:text-gray-100 font-bold">{user.email}</span>!
            </p>
            <Link 
              href={`/${role}`} 
              className="inline-block bg-neu-secondary hover:bg-neu-primary text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transition transform hover:-translate-y-1"
            >
              Go to My Dashboard
            </Link>
          </div>
        )}
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl w-full text-left">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="w-12 h-12 bg-neu-light dark:bg-gray-700 text-neu-primary dark:text-neu-light rounded-lg flex items-center justify-center mb-4 text-2xl font-bold">🎓</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">For Students</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Easily search through a verified list of active and approved partner companies for your OJT requirements.</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="w-12 h-12 bg-neu-light dark:bg-gray-700 text-neu-primary dark:text-neu-light rounded-lg flex items-center justify-center mb-4 text-2xl font-bold">👨‍🏫</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">For Faculty</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Monitor the processing status of MOAs endorsed by your specific college in real-time.</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="w-12 h-12 bg-neu-light dark:bg-gray-700 text-neu-primary dark:text-neu-light rounded-lg flex items-center justify-center mb-4 text-2xl font-bold">🛡️</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">For Admins</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Manage the entire database, track audit trails, and ensure legal compliance with zero hard deletes.</p>
        </div>
      </div>

    </div>
  );
}