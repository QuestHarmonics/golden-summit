import { Link } from 'react-router-dom';
import { useStore } from '../../store';

export default function Navbar() {
  const user = useStore((state) => state.user);
  const currentEnergy = useResourceStore((state) => state.getCurrentEnergy());

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">Golden Summit</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4">
              <div className="text-sm">Energy: {currentEnergy}</div>
            </div>
            {user && (
              <div className="flex items-center">
                <Link to="/profile" className="text-sm">
                  {user.username}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 