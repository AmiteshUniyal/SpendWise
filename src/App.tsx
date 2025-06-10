import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter } from "react-router-dom";
import { AppContext, AppProvider } from "./context/contextAPI";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import HomePage from "./pages/HomePage";
import AssistantPage from "./pages/AIAssistantPage";
import ProfilePage from "./pages/ProfilePage";
import { useAppContext } from "./hooks/useAppContext";
import { FaSpinner } from "react-icons/fa";
import { useEffect } from "react";

const queryClient = new QueryClient();

function InnerApp() {
    const { authenticated, loading } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();

    // ... existing code ...
} 