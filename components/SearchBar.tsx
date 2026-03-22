"use client";
import React from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="relative w-full shadow-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-neu-primary focus:border-neu-primary block w-full p-4 pl-12 focus:outline-none transition-colors"
        placeholder="Search by HTE ID, company, contact, or address..."
      />
    </div>
  );
}