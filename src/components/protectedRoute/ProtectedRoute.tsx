import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import paths from 'routes/path';

interface ProtectedRouteProps {
  children: ReactNode;
  redirect: string; // optional with default
}

function ProtectedRoute({ children, redirect }: ProtectedRouteProps) {
  const token = useSelector((state: RootState) => state.auth.authData.token);
 
  // const token = Boolean(Cookies.get(' useToken'));
  if (!token) return <Navigate to={redirect} />;
  return <>{children}</>;
}

export default ProtectedRoute;
