import React from 'react';
import { Search, Image as ImageIcon } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="px-4 pb-4 bg-white sticky top-[64px] z-40">
      <div className="relative max-w-7xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-12 py-3 bg-gray-100 border-none rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-colors"
          placeholder="Search photos"
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
          <div className="text-emerald-500">
             <ImageIcon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
