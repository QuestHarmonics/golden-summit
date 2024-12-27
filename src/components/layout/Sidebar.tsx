import { NavLink } from 'react-router-dom';

const navigationItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/tasks', label: 'Tasks', icon: '📝' },
  { path: '/skills', label: 'Skills', icon: '⭐' },
  { path: '/map', label: 'Map', icon: '🗺️' },
  { path: '/profile', label: 'Profile', icon: '👤' }
];

export function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        {navigationItems.map((item) => (
          <li key={item.path}>
            <NavLink to={item.path}>
              {item.icon} {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
} 