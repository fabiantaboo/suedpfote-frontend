'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Customer = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  metadata?: {
    loyalty_points?: number;
  };
};

type AuthContextType = {
  customer: Customer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCustomer = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCustomer(data.customer);
      } else {
        setCustomer(null);
      }
    } catch {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCustomer();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login fehlgeschlagen');
    }
    
    await refreshCustomer();
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ customer, loading, login, logout, refreshCustomer }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
