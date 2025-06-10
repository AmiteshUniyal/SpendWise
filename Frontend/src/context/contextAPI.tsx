import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AppContextType {
  authenticated: boolean;
  loading: boolean;
  authUser: User | null;
  checkAuth: () => Promise<void>;
}



export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
console.log("AppProvider is wrapping children");

  // Authentication state
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState<User | null>(null);

  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get<User>('/auth/me', { withCredentials: true });
      setAuthenticated(true);
      setAuthUser(res.data || null);
      console.log('User authenticated:', res.data);
    } 
    catch (error: any) {
      if (error.response?.status === 401) {
        setAuthenticated(false);
        setAuthUser(null);
      } else {
        console.error('Unexpected error during authentication check:', error.response?.data?.error || error.message);
      }
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);


  const contextValues: AppContextType = {
    authenticated,
    loading,
    authUser,
    checkAuth,
  };

  return (
    <AppContext.Provider value={contextValues}>
      {children}
    </AppContext.Provider>
  );
};
