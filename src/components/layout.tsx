import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Outlet />
      {children}
    </div>
  );
}; 