'use client';

import { useAuth } from "react-oidc-context";
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import ActivityTable from '../components/ActivityTable';
import DashboardStats from '../components/DashboardStats';

export default function Dashboard() {
  const auth = useAuth();
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalScans: 0,
    vulnerabilitiesFound: 0,
    lastScanDate: null
  });

  useEffect(() => {
    // Fetch user's activities
    // TODO: Replace with actual API call
    const mockActivities = [
      {
        id: 1,
        fileName: 'contract_1.sol',
        timestamp: new Date().toISOString(),
        vulnerabilities: 3,
        status: 'completed'
      }
    ];
    setActivities(mockActivities);
  }, []);

  if (!auth.isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-white">Please login to view your dashboard</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950">
      {/* <Header /> */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
        <DashboardStats stats={stats} />
        <ActivityTable activities={activities} />
      </div>
    </main>
  );
}