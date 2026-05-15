import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      const storagedUser = localStorage.getItem('@TaskFlow:user');
      const storagedToken = localStorage.getItem('@TaskFlow:token');

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
        try {
          // Validate token
          await api.get('/auth/me');
        } catch (err) {
          // Interceptor vai dar logout
        }
      }
      setLoading(false);
    };

    loadStorageData();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user: userData } = response.data;
    
    localStorage.setItem('@TaskFlow:token', token);
    localStorage.setItem('@TaskFlow:user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    const { token, user: userData } = response.data;
    
    localStorage.setItem('@TaskFlow:token', token);
    localStorage.setItem('@TaskFlow:user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('@TaskFlow:token');
    localStorage.removeItem('@TaskFlow:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
