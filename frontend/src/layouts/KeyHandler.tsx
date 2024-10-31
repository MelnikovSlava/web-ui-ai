import { Navigate, Outlet } from "react-router";
import { useOpenrouterKey } from "../hooks/useOpenrouterKey";
import { routes } from "../router";

export const KeyHandler = () => {
	const key = useOpenrouterKey();

	if (!key) {
		return <Navigate to={routes.key} replace />;
	}

	return <Outlet />;
};
