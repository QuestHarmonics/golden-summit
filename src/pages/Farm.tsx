import React from 'react';
import { useFarmStore } from '../store/farmStore';
import { FarmDashboard } from '../components/farm/FarmDashboard';
import { PlotManager } from '../components/farm/PlotManager';
import { WeatherPanel } from '../components/farm/WeatherPanel';
import { ResourceTracker } from '../components/farm/ResourceTracker';
import { ProjectTimeline } from '../components/farm/ProjectTimeline';

export function FarmPage() {
  return (
    <div className="p-4 h-full bg-gray-900">
      <h1 className="text-2xl font-pixel text-white mb-4">FARM MANAGEMENT</h1>
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <FarmDashboard />
          <PlotManager />
        </div>
        <div className="space-y-4">
          <WeatherPanel />
          <ResourceTracker />
        </div>
      </div>
      
      <div className="mt-4">
        <ProjectTimeline />
      </div>
    </div>
  );
} 