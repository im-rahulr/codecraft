import React, { useState, useRef, useEffect } from 'react';
import { Menu, HelpCircle, Grid, MessageSquareWarning, ChevronRight, User, Settings, LogOut } from 'lucide-react';
import { GooglePhotosIcon } from './Icons';

interface Account {
  email: string;
  name: string;
  avatar: string;
}

const accounts: Account[] = [
  {
    email: 'loverefiles@gmail.com',
    name: 'LoveRe Files',
    avatar: 'https://picsum.photos/seed/user1/100/100',
  },
  {
    email: 'rahul.photos@gmail.com',
    name: 'Rahul Photos',
    avatar: 'https://picsum.photos/seed/user2/100/100',
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
            <span className="text-xl font-normal text-gray-600 tracking-tight">Lovere Files</span>
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
             <img src="https://picsum.photos/seed/user/100/100" alt="User" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      {/* Gmail Account View Overlay */}
      {showAccountView && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end pt-16 pr-4"
          onClick={() => setShowAccountView(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl w-80 overflow-hidden animate-fadeIn"
            ref={accountViewRef}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Account Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/user/100/100" 
                    alt="User" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">LoveRe Files</h3>
                  <p className="text-white/80 text-sm">loverefiles@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Account List */}
            <div className="p-2">
              {accounts.map((account, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={account.avatar} 
                      alt={account.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{account.name}</p>
                    <p className="text-sm text-gray-500">{account.email}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mx-2" />

            {/* Account Actions */}
            <div className="p-2">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Add another account</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Manage your Google Account</span>
              </div>
            </div>

            <div className="border-t border-gray-200 mx-2" />

            {/* Sign Out */}
            <div className="p-2">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                <LogOut className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Sign out</span>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-3 text-center">
              <p className="text-xs text-gray-500">
                Privacy Policy • Terms of Service
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
