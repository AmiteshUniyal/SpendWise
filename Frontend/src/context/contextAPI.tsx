import { createContext, useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import axiosInstance from '../api/axiosConfig';

interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  income: number;
  currency: string;
  goal: string;
  goalAmount:number;
  goalSetDate:string,
}


interface Transaction {
  _id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
}


interface AppContextType {
  authenticated: boolean;
  loading: boolean;
  authUser: User | null;
  checkAuth: () => Promise<void>;
  isOpen:boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  transactions: Transaction[];
  fetchTransaction: () => Promise<void>,
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  showIncomeModal: boolean;
  editModalOpen:boolean;
  setEditModalOpen: Dispatch<SetStateAction<boolean>>;
  editingTransaction: Transaction | null;
  setEditingTransaction:Dispatch<SetStateAction<Transaction | null>>;
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
}



export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  
  // Authentication state
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authUser, setAuthUser] = useState<User | null>(null);
  

  const checkAuth = async () => {
    
    try {      
      const res = await axiosInstance.get<User>('/auth/me', {withCredentials : true});
      setAuthenticated(true);
      setAuthUser(res.data || null);
      console.log('User authenticated:', res.data);
    } 
    catch (error: any) {
      if (error.response?.status === 401) {
        setAuthenticated(false);
        setAuthUser(null);
      } 
      else {
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

  
  
  
  //transactions form toggle state 
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransaction = async() =>{
    try {
      const res = await axiosInstance.get("/transaction/all", {withCredentials : true});
      setTransactions(res.data);
    } 
    catch (error) {
      console.log(error , "error in fetching transactions");
    }
  }

  //toggle button for goalModal
  const showIncomeModal = authenticated && (authUser?.income === 0 || authUser?.goal === "" || authUser?.goalAmount === 0 || !authUser?.goalSetDate );

  //editTransactionModal toggle
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);


// toggle Dark mode and light mode
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const contextValues: AppContextType = {
    authenticated,
    loading,
    authUser,
    checkAuth,
    isOpen,
    setIsOpen,
    transactions,
    fetchTransaction,
    setTransactions,
    showIncomeModal,
    editModalOpen,
    setEditModalOpen,
    editingTransaction,
    setEditingTransaction,
    darkMode,
    setDarkMode,
  };

  return (
    <AppContext.Provider value={contextValues}>
      {children}
    </AppContext.Provider>
  );
};
