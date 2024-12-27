import React from 'react';
import { Tabs, TabPanel } from '../components/ui/Tabs';

export function SustainabilityPage() {
  return (
    <div className="p-4 h-full bg-gray-900">
      <h1 className="text-2xl font-pixel text-white mb-4">
        SUSTAINABILITY MANAGEMENT
      </h1>
      
      <Tabs>
        <TabPanel title="OVERVIEW">
          <SustainabilityDashboard />
        </TabPanel>
        <TabPanel title="RESOURCES">
          <ResourceManagement />
        </TabPanel>
        <TabPanel title="PROJECTS">
          <ProjectManagement />
        </TabPanel>
        <TabPanel title="SKILLS">
          <SkillProgression />
        </TabPanel>
        <TabPanel title="ECOSYSTEM">
          <EcosystemHealth />
        </TabPanel>
      </Tabs>
    </div>
  );
} 