// // components/PublicRoute.tsx
// import { Navigate, Outlet } from "react-router-dom";
// import { useAppContext } from "../context/useAppContext";

// const PublicRoute = () => {
//   const {authenticated, loading } = useAppContext();

//   if (loading) return null;

//   return !authenticated ? <Outlet /> : <Navigate to="/" replace />;
// };

// export default PublicRoute;
