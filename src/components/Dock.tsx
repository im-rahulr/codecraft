import React from 'react';
import { GooglePhotosIcon } from './Icons';

interface DockProps {
  currentView: 'photos';
  onViewChange: (view: 'photos') => void;
}

export default function Dock({ currentView, onViewChange }: DockProps) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 sm:gap-4 px-4 py-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
        <DockItem 
          icon={<GooglePhotosIcon className="w-8 h-8" />} 
          label="Photos" 
          active={currentView === 'photos'} 
          onClick={() => onViewChange('photos')}
        />
        
              </div>
    </div>
  );
}

function DockItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`p-2 rounded-xl transition-all cursor-pointer ${active ? 'bg-gray-100 shadow-inner' : 'hover:bg-gray-50 hover:-translate-y-1'}`}
      title={label}
    >
      {icon}
    </div>
  );
}
