import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { QuickInputPanel } from '../quickInput/QuickInputPanel';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      
      <QuickInputPanel />
    </div>
  );
} 