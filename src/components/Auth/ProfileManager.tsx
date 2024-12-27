import { ReactNode } from 'react';

interface ProfileManagerProps {
  children?: ReactNode;
}

export const ProfileManager = ({ children }: ProfileManagerProps) => {
  return (
    <div className="profile-manager">
      <h1>Profile</h1>
      {children}
    </div>
  );
}; 