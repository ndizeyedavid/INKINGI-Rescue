
import React from 'react';
import Link from 'next/link';
import { Home, Siren, Shield, Users, BarChart3, Settings } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Active Rescues', href: '/rescues', icon: Siren },
  { name: 'Responders', href: '/responders', icon: Shield },
  { name: 'Citizens', href: '/citizens', icon: Users },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  // In a real app, you would use the usePathname() hook from next/navigation to get the current path
  const currentPath = '/';

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-background border-r border-border flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-border">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          🛟 Inkingi Rescue
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => (
          <Link href={link.href} key={link.name}>
            <div
              className={`
                flex items-center gap-3 px-4 py-2 rounded-lg transition-all cursor-pointer
                group hover:text-primary hover:border-l-4 hover:border-primary
                ${
                  currentPath === link.href
                    ? 'text-primary border-l-4 border-primary font-bold bg-primary/10'
                    : 'text-textLight border-l-4 border-transparent'
                }
              `}
            >
              <link.icon size={20} />
              <span>{link.name}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
