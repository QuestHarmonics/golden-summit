import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Lazy load auth components
const Login = lazy(() => import('../components/Login'));
const Register = lazy(() => import('../components/Register'));
const PasswordReset = lazy(() => import('../components/PasswordReset'));

export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    element: (
      <ProtectedRoute requireAuth={false}>
        <Login />
      </ProtectedRoute>
    )
  },
  {
    path: 'register',
    element: (
      <ProtectedRoute requireAuth={false}>
        <Register />
      </ProtectedRoute>
    )
  },
  {
    path: 'reset-password',
    element: (
      <ProtectedRoute requireAuth={false}>
        <PasswordReset />
      </ProtectedRoute>
    )
  }
]; 