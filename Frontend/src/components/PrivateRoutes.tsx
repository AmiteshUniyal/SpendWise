// // components/PrivateRoute.tsx
// import { Navigate, Outlet } from "react-router-dom";
// import { useAppContext } from "../context/useAppContext";
// import { FaSpinner } from "react-icons/fa";

// const PrivateRoute = () => {
//   const { authenticated, loading } = useAppContext();

//   if (isLoading) {
//       return (
//         <div className="h-screen w-screen flex flex-col justify-center items-center text-white px-4 text-center space-y-4">
//           <div className="flex items-center space-x-2">
//             <FaSpinner className="text-4xl text-blue-400 animate-spin" />
//             <span className="text-lg text-gray-200">Please wait...</span>
//           </div>
//           <div className="max-w-md">
//             <h2 className="text-blue-400 font-semibold text-lg">🚀 Starting App</h2>
//             <p className="text-sm text-gray-400 mt-1">
//               Just a moment! We're getting everything ready for you.
//             </p>
//           </div>
//         </div>
//       );
//     }

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default PrivateRoute;
