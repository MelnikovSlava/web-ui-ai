import { Navigate, Outlet } from 'react-router';
import { useJwtToken } from '../hooks/useJwtToken';
import { routes } from '../router';


export const AuthRequired = () => {
  const token = useJwtToken();

  if (!token) {
    return <Navigate to={routes.auth} replace />;
  }

  return <Outlet />;
};
