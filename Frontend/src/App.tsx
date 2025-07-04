import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import HomePage from "./pages/homepage/HomePage";
import AssistantPage from "./pages/assistant/AIAssistantPage";
import ProfilePage from "./pages/profile/ProfilePage";
import Navbar from "./components/NavBar";
import { useAppContext } from "./context/useAppContext";
import { FaSpinner } from "react-icons/fa";
import { useEffect } from "react";
import GoalModal from "./components/GoalModal";


const App = () => {
  const { authenticated, loading, showIncomeModal, darkMode } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } 
    else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (
      !loading &&
      !authenticated &&
      location.pathname !== "/login" &&
      location.pathname !== "/signup"
    ) {
      navigate("/login");
    }
  }, [authenticated, loading, location.pathname, navigate]);

  const hideSidebar = ["/login", "/signup"];
  const showSidebar = authenticated && !hideSidebar.includes(location.pathname);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center text-black px-4 text-center space-y-4">
        <div className="flex items-center space-x-2">
          <FaSpinner className="text-4xl text-blue-600 animate-spin" />
          <span className="text-lg text-gray-500">Please wait...</span>
        </div>
        <div className="max-w-md">
          <h2 className="text-blue-600 font-semibold text-lg">🚀 Starting App</h2>
          <p className="text-sm text-gray-500 mt-1">
            Just a moment! We're getting everything ready for you.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen min-w-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 md:p-10 md:px-10 lg:px-60">
      {showIncomeModal && <GoalModal/>}
      {showSidebar && <Navbar/>}
      <Routes>
      {authenticated ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
