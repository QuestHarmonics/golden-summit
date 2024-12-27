import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { Login } from './features/auth/pages/Login';
import { Register } from './features/auth/pages/Register';
import { ForgotPassword } from './features/auth/pages/ForgotPassword';
import Dashboard from './features/dashboard/pages/Dashboard';
import QuestBoard from './features/quests/pages/QuestBoard';
import FamilyProfile from './features/family/pages/FamilyProfile';
import { ProfilePage } from './features/profile/pages/ProfilePage';
import { useAuthStore } from './features/auth/store/authStore';
import { ErrorBoundary } from './components/ErrorBoundary';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuthStore();
  return currentUser ? <>{children}</> : <Navigate to="/auth/login" />;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuthStore();
  return !currentUser ? <>{children}</> : <Navigate to="/" />;
};

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      errorElement: <ErrorBoundary />,
      children: [
        {
          index: true,
          element: <Dashboard />
        },
        {
          path: 'quests',
          element: <QuestBoard />
        },
        {
          path: 'family',
          element: <FamilyProfile />
        },
        {
          path: 'profile',
          element: <ProfilePage />
        }
      ]
    },
    {
      path: '/auth',
      element: <AuthLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: 'login',
          element: (
            <AuthRoute>
              <Login />
            </AuthRoute>
          )
        },
        {
          path: 'register',
          element: (
            <AuthRoute>
              <Register />
            </AuthRoute>
          )
        },
        {
          path: 'forgot-password',
          element: (
            <AuthRoute>
              <ForgotPassword />
            </AuthRoute>
          )
        }
      ]
    },
    {
      path: '*',
      element: <ErrorBoundary />
    }
  ],
  {
    basename: '/golden-summit'
  }
); 