import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import type { SignupCredentials } from '../../types/auth.types';
import { useAppContext } from '../../context/useAppContext';


const SignupPage: React.FC = () => {
    
    const navigate = useNavigate();
    const [validationError, setValidationError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<{ message: string } | null>(null);
    const {checkAuth} = useAppContext();
    

    const [formData, setFormData] = useState<SignupCredentials>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setValidationError('');
    };

    const validateForm = (): boolean => {
        if (formData.password !== formData.confirmPassword) {
            setValidationError("Passwords don't match");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            
            setIsLoading(true);
            setError(null);

            try {
                const res = await axiosInstance.post("/auth/signup", formData, { withCredentials: true });
                console.log('Login success:', res.data);
                await checkAuth();
                navigate('/');
            } 
            catch (err: any) {
                const msg = err.response?.data?.error || 'Login failed. Try again.';
                setError({ message: msg });
            } 
            finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                    to="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                    Sign in
                </Link>
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm -space-y-px">
                <div>
                    <label htmlFor="username" className="sr-only">Username</label>
                    <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Username"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Email address"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Password"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                    <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirm Password"
                    />
                </div>
                </div>

                {(error || validationError) && (
                <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
                    <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        {validationError || error?.message}
                        </h3>
                    </div>
                    </div>
                </div>
                )}

                <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        ></circle>
                        <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    ) : (
                    'Sign up'
                    )}
                </button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default SignupPage; 