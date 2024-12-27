import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register } = useGameStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting to login with username:', username);
    login(username, password);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting to register with username:', username);
    register(username, password);
  };

  return (
    <div className="login-screen">
      <h1>{isRegistering ? 'Register' : 'Login'}</h1>
      <form onSubmit={isRegistering ? handleRegister : handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Switch to Login' : 'Switch to Register'}
      </button>
    </div>
  );
}; 