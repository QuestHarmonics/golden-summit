import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store';

export function Navbar() {
  const { user, logout } = useStore();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-xl">Golden Summit</span>
            </Link>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/tasks"
                className="inline-flex items-center px-1 pt-1 text-gray-900"
              >
                Tasks
              </Link>
              <Link
                to="/skills"
                className="inline-flex items-center px-1 pt-1 text-gray-900"
              >
                Skills
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center px-1 pt-1 text-gray-900"
              >
                Profile
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user && (
              <>
                <span className="text-gray-700 mr-4">{user.username}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 