
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Institution {
  id: number;
  name: string;
  email: string;
  hasPaid: boolean;
  plan: string;
}

interface AuthContextType {
  institution: Institution | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedInstitution = localStorage.getItem('institution');
    if (storedInstitution) {
      setInstitution(JSON.parse(storedInstitution));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Mock authentication - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockInstitution: Institution = {
        id: 1,
        name: "University of Excellence",
        email: email,
        hasPaid: true,
        plan: "pro"
      };

      setInstitution(mockInstitution);
      localStorage.setItem('institution', JSON.stringify(mockInstitution));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setInstitution(null);
    localStorage.removeItem('institution');
  };

  return (
    <AuthContext.Provider value={{ institution, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
