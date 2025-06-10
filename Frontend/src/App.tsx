import { Routes, Route, useLocation, useNavigate} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import HomePage from "./pages/HomePage";
import AssistantPage from "./pages/AIAssistantPage";
import ProfilePage from "./pages/ProfilePage";
import { useAppContext } from "./context/useAppContext";
import { FaSpinner } from "react-icons/fa";
import { useEffect } from "react";


const App = () => {
  const { authenticated, loading } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  
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

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center text-white px-4 text-center space-y-4">
        <div className="flex items-center space-x-2">
          <FaSpinner className="text-4xl text-blue-400 animate-spin" />
          <span className="text-lg text-gray-200">Please wait...</span>
        </div>
        <div className="max-w-md">
          <h2 className="text-blue-400 font-semibold text-lg">🚀 Starting App</h2>
          <p className="text-sm text-gray-400 mt-1">
            Just a moment! We're getting everything ready for you.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      {authenticated && (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </>
      )}
    </Routes>
  );
}

export default App;
