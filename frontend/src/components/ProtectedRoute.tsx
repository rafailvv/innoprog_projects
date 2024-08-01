import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = (): JSX.Element => {
    const isLoggedIn = localStorage.getItem('token');
    return isLoggedIn ?
        <Navigate to="/projects" /> : <Outlet />;
};

export default ProtectedRoute;