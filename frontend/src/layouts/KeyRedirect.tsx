import { Navigate, Outlet } from "react-router";
import { useOpenrouterKey } from "../hooks/useOpenrouterKey";
import { routes } from "../router";

export const KeyRedirect = () => {
	const key = useOpenrouterKey();

	if (key) {
		return <Navigate to={routes.root} replace />;
	}

	return <Outlet />;
};
