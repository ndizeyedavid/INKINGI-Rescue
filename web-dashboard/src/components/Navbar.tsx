
import React from 'react';
import { Bell, Search } from 'lucide-react';

// Using a static name for the avatar for now
const name = "Sonia Ineza";
const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

const Navbar = () => {
  return (
    <header className="fixed top-0 left-64 right-0 h-20 bg-background border-b border-primary flex items-center justify-between px-8 z-10">
      <div className="flex items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search emergency ID..."
            className="bg-gray-100 border border-gray-200 rounded-lg pl-10 pr-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative text-gray-600 hover:text-primary">
          <Bell size={24} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">3</span>
        </button>
        <div className="flex items-center gap-3 cursor-pointer">
           <img
            src={avatarUrl}
            alt={name}
            className="w-10 h-10 rounded-full border-2 border-primary shadow-md"
          />
          <div>
            <p className="font-semibold text-text">{name}</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
