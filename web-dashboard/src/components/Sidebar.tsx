'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Shield, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Dashboard', icon: <LayoutDashboard /> },
    { href: '/users', label: 'Users', icon: <Users /> },
    { href: '/reports', label: 'Reports', icon: <FileText /> },
    { href: '/responders', label: 'Responders', icon: <Shield /> },
    { href: '/settings', label: 'Settings', icon: <Settings /> },
  ];

  return (
    <div className="bg-white text-text w-64 p-4 flex flex-col h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Inkingi Rescue</h1>
      </div>
      <nav className="flex-grow">
        <ul>
          {links.map(link => (
            <li key={link.href} className="mb-4">
              <Link href={link.href} className={`flex items-center p-3 rounded-lg transition-colors ${pathname === link.href ? 'bg-primary text-white' : 'hover:bg-background'}`}>
                <div className="mr-4">{link.icon}</div>
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <button className="flex items-center p-3 rounded-lg text-red-500 hover:bg-red-50 w-full">
          <div className="mr-4"><LogOut /></div>
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
