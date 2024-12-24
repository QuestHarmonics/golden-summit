import { NavLink } from 'react-router-dom';
import { Routes } from '../../types/routes';

const navItems = [
  { path: Routes.QUESTS, label: 'Quests' },
  { path: Routes.SKILLS, label: 'Skills' },
  { path: Routes.MAP, label: 'Map' },
  { path: Routes.TASKS, label: 'Tasks' },
  { path: Routes.HABITS, label: 'Habits' },
  { path: Routes.JOURNAL, label: 'Journal' },
  { path: Routes.ACHIEVEMENTS, label: 'Achievements' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg">
      <nav className="mt-5 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `mt-1 group flex items-center px-2 py-2 text-sm font-medium rounded-md
              ${isActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
} 