import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        // Handle 401 errors silently
        if (error.code !== 401) {
          console.error('Auth check error:', error);
        }
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const signIn = async (email, password) => {
    try {
      const authUser = await loginUser(email, password);
      setUser(authUser);
      return authUser;
    } catch (error) {
      // Handle 401 errors specifically
      if (error.code === 401) {
        throw new Error('Invalid email or password');
      }
      throw error;
    }
  };

  const signUp = async (name, email, password, role) => {
    try {
      const newUser = await registerUser(name, email, password, role);
      setUser(newUser);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await logoutUser();
      setUser(null);
      return true;
    } catch (error) {
      // Handle 401 errors silently
      if (error.code !== 401) {
        throw error;
      }
      return true;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}