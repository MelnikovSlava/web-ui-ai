import { Navigate, Outlet } from "react-router";
import { useJwtToken } from "../hooks/useJwtToken";
import { routes } from "../router";

export const AuthRedirect = () => {
	const token = useJwtToken();

	if (token) {
		return <Navigate to={routes.root} replace />;
	}

	return <Outlet />;
};
