import { useState } from 'react';
import { useStore } from '../store/rootStore';

export function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  const { setGameStarted } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      // TODO: Save user data to store
      setGameStarted(true);
    }
  };

  return (
    <div className="registration">
      <h2>Create Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Start Your Journey
        </button>
      </form>
    </div>
  );
} 