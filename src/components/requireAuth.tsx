import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    // Allow access to protected routes
    return <Outlet />;
};

export default RequireAuth;