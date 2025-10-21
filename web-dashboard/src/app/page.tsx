'use client';

import { Shield, Users, Siren, Map, Activity, Clock, LucideIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

const RescueMap = dynamic(() => import('@/components/RescueMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center"><p className='text-gray-500'>Loading map...</p></div>
});

const stats: { name: string; value: string; icon: LucideIcon }[] = [
  { name: 'Total Rescues', value: '1,200', icon: Shield },
  { name: 'Active Responders', value: '85', icon: Users },
  { name: 'Citizens Protected', value: '50,000+', icon: Siren },
];

const recentActivities: { id: number; type: string; description: string; timestamp: string }[] = [
  {
    id: 1,
    type: 'New Emergency',
    description: 'Fire reported at Nyarugenge Market.',
    timestamp: '2 mins ago',
  },
  {
    id: 2,
    type: 'Responder Dispatched',
    description: 'Team Bravo sent to Gasabo district.',
    timestamp: '5 mins ago',
  },
  {
    id: 3,
    type: 'Emergency Resolved',
    description: 'Medical situation at CHUK handled.',
    timestamp: '15 mins ago',
  },
  {
    id: 4,
    type: 'New User Registered',
    description: 'A new citizen from Kicukiro joined.',
    timestamp: '30 mins ago',
  },
];

const StatCard = ({ name, value, icon: Icon }: { name: string; value: string; icon: LucideIcon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-6">
    <div className="bg-primary/10 p-4 rounded-xl">
      <Icon size={32} className="text-primary" />
    </div>
    <div>
      <p className="text-textLight text-sm font-medium">{name}</p>
      <p className="text-text text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const RecentActivityItem = ({ activity }: { activity: { id: number; type: string; description: string; timestamp: string } }) => (
  <div className="flex items-start gap-4 py-3">
    <div className="bg-primary/10 p-3 rounded-full">
      <Activity size={20} className="text-primary" />
    </div>
    <div className="flex-1">
      <p className="font-semibold text-text">{activity.type}</p>
      <p className="text-sm text-textLight">{activity.description}</p>
    </div>
    <div className="flex items-center gap-2 text-xs text-gray-400">
      <Clock size={14} />
      <span>{activity.timestamp}</span>
    </div>
  </div>
);


export default function DashboardPage() {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-text mb-2">Dashboard Overview</h1>
      <p className="text-textLight mb-8">Welcome back, Sonia! Here is your daily summary.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.name} {...stat} />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Map and Emergencies (Left and Middle) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Map size={24} className="text-primary" />
            <h2 className="text-xl font-bold text-text">Live Rescue Map</h2>
          </div>
          <div className="h-96 rounded-xl overflow-hidden">
            <RescueMap />
          </div>
        </div>

        {/* Recent Activity (Right) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-text mb-4">Recent Activity</h2>
          <div className="-my-3 divide-y divide-border">
            {recentActivities.map((activity) => (
              <RecentActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
