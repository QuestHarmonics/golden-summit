import { useGameLoop } from '../../hooks/useGameLoop';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { EnergyBar } from './EnergyBar/index';
import { TimeDisplay } from './TimeDisplay';

export function Layout({ children }: { children: React.ReactNode }) {
  // Only use gameLoop if you need it in Layout
  // If not needed, remove this line
  // useGameLoop();  // Remove if not needed

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
          <div className="flex justify-between mb-4">
            <TimeDisplay />
            <EnergyBar />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
} 