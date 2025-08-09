import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import IndexPage from './pages/Index';
import NotFound from './pages/NotFound';
import { useAuth } from './contexts/AuthContext';
import { ReactNode } from 'react';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return <div>در حال بارگذاری...</div>; // Or a spinner component
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const GuestRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return <div>در حال بارگذاری...</div>;
    }
    return !isAuthenticated ? children : <Navigate to="/" />;
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <PrivateRoute><App /></PrivateRoute>,
        children: [
            {
                index: true,
                element: <IndexPage />
            }
        ]
    },
    {
        path: '/login',
        element: <GuestRoute><LoginPage /></GuestRoute>
    },
    {
        path: '/register',
        element: <GuestRoute><RegisterPage /></GuestRoute>
    },
    {
        path: '*',
        element: <NotFound />
    }
]);

export default router;
