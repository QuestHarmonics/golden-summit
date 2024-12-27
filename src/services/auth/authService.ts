import { User } from '../../types/user';

export async function loginUser(email: string, password: string): Promise<User> {
  // TODO: Replace with actual API call
  if (!email || !password) {
    throw new Error('Invalid credentials');
  }

  // Simulate API call
  return {
    id: '1',
    email,
    username: email.split('@')[0],
    createdAt: new Date(),
    lastLogin: new Date()
  };
}

export async function registerUser(email: string, password: string): Promise<User> {
  // TODO: Replace with actual API call
  return loginUser(email, password);
} 