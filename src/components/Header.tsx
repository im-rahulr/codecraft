import React, { useState, useRef, useEffect } from 'react';
import { Menu, HelpCircle, Grid, MessageSquareWarning, User, Settings, LogOut } from 'lucide-react';
import { GooglePhotosIcon } from './Icons';

interface Account {
  email: string;
  name: string;
  avatar: string;
}

const accounts: Account[] = [
  {
    email: 'chirag420@gmail.com',
    name: 'Chirag',
    avatar: 'https://picsum.photos/seed/chirag/100/100',
  },
];

export default function Header() {
  const [showAccountView, setShowAccountView] = useState(false);
  const accountViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountViewRef.current && !accountViewRef.current.contains(event.target as Node)) {
        setShowAccountView(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAccountClick = () => {
    setShowAccountView(!showAccountView);
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <GooglePhotosIcon className="w-8 h-8" />
            <span className="text-xl font-normal text-gray-600 tracking-tight">JPhotos</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full hidden sm:block">
            <MessageSquareWarning className="w-6 h-6 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full hidden sm:block">
            <HelpCircle className="w-6 h-6 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Grid className="w-6 h-6 text-gray-600" />
          </button>
          <button 
            onClick={handleAccountClick}
            className="w-8 h-8 rounded-full bg-emerald-600 overflow-hidden border border-gray-200 hover:ring-2 hover:ring-blue-400 transition-all"
          >
             <img src="https://picsum.photos/seed/chirag/100/100" alt="User" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      {/* Google Account View Overlay */}
      {showAccountView && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-end pt-14 pr-2"
          onClick={() => setShowAccountView(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-lg w-96 overflow-hidden"
            ref={accountViewRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
            }}
          >
            {/* Current Account Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <img 
                    src="https://picsum.photos/seed/chirag/100/100" 
                    alt="User" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm">Chirag</h3>
                  <p className="text-gray-600 text-sm truncate">chirag420@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Account List */}
            <div className="py-2">
              {accounts.map((account, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={account.avatar} 
                      alt={account.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm">{account.name}</p>
                    <p className="text-gray-500 text-xs">{account.email}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200" />

            {/* Account Actions */}
            <div className="py-2">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                <User className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Add another account</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                <Settings className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Manage your Google Account</span>
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Sign Out */}
            <div className="py-2">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                <LogOut className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <span className="text-gray-700 text-sm">Sign out</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
