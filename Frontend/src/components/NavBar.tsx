import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bot, User, LogOut} from "lucide-react";
import axiosInstance from "../api/axiosConfig"; 
import { Moon, Sun } from "lucide-react";
import { useAppContext } from "../context/useAppContext";

const IconButton = ({ children }: { children: React.ReactNode }) => (
  <button className="rounded-2xl bg-white p-2 shadow-sm transition hover:shadow-md dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    {children}
  </button>
);

const Navbar = () => {
  
  const {darkMode, setDarkMode} = useAppContext();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);



  const Logout = async (): Promise<void> => {
    try {
      const response = await axiosInstance.post("/auth/logout", {
        withCredentials: true,
      });
      console.log(response.data);
    } 
    catch (error: any) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };


  return (
    <nav className="mb-6 flex items-center justify-between rounded-2xl dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-6 py-4 shadow-md">
      <Link to="/" className="text-3xl font-bold text-indigo-600  dark:text-blue-400 cursor-pointer">
        SpendWise
      </Link>
      <div className="hidden gap-4 md:flex">
        <div onClick={() => setDarkMode(prev => !prev)} className=" cursor-pointer rounded-2xl bg-white p-2 shadow-sm transition hover:shadow-md h-10 w-10 lg:h-12 lg:w-12 hover:text-indigo-600  dark:bg-gray-800">
          <Moon className={`absolute h-6 w-6 lg:h-8 lg:w-8 transition-all duration-500 ease-in-out ${darkMode ? 'opacity-100 rotate-0' : 'opacity-0 rotate-[-90deg]'}`}/>
          <Sun className={`absolute h-6 w-6 lg:h-8 lg:w-8 transition-all duration-500 ease-in-out ${!darkMode ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'} `}/>        
        </div>
        <Link to="/assistant" className="hover:text-indigo-600  cursor-pointer">
          <IconButton>
            <Bot className="h-6 w-6  lg:h-7 lg:w-7" />
          </IconButton>
        </Link>
        <Link to="/profile" className="hover:text-indigo-600  cursor-pointer">
          <IconButton>
            <User className="h-6 w-6 lg:h-7 lg:w-7" />
          </IconButton>
        </Link>
        <Link to="/login" onClick={Logout} className="hover:text-red-600  cursor-pointer">
          <IconButton>
            <LogOut className="h-6 w-6 lg:h-7 lg:w-7" />
          </IconButton>
        </Link>
      </div>

      <div className="md:hidden ml-4 mb-4" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative text-gray-600"
        >
          <div className="flex flex-col gap-1  cursor-pointer">
            <span className={`h-0.5 w-6 bg-black dark:bg-gray-100 text-gray-100  transition-all duration-300 ${isOpen ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`h-0.5 w-6 bg-black dark:bg-gray-100 text-gray-100  transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-black dark:bg-gray-100 text-gray-100  transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </div>
        </button>
      
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="absolute right-4 top-24 z-50 flex w-44 flex-col gap-3 rounded-xl bg-white p-4 text-base shadow-md md:hidden dark:bg-gray-900">
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 cursor-pointer"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5 text-gray-800" />}
            <span>{!darkMode ? "Dark Mode" : "Light Mode"}</span>
          </button>
          <Link to="/assistant" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 cursor-pointer">
            <Bot className="h-5 w-5" />
            <span>Assistant</span>
          </Link>
          <Link to="/profile" className="flex items-center gap-3 text-gray-700 dark:text-gray-200 cursor-pointer">
            <User className="h-5 w-5" />
            <span>Profile</span>
          </Link>
          <Link to="/login" onClick={Logout} className="flex items-center gap-3 text-gray-700 dark:text-gray-200 cursor-pointer">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </div>
      )}
      </div>

    </nav>
  );
};

export default Navbar;
