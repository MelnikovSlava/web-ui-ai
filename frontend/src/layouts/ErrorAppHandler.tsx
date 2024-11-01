import { Navigate, isRouteErrorResponse, useRouteError } from "react-router";
import { routes } from "../router";

export const ErrorAppHandler = () => {
	const error = useRouteError();

	let desc = "Something went wrong";

	if (error instanceof Response || isRouteErrorResponse(error)) {
		if (error.status === 401) {
			return <Navigate to={routes.auth} />;
		}

		if (error.status === 404) {
			return <Navigate to={routes.root} />;
		}

		if (error.status >= 500) {
			desc = "Looks like our server is down";
		}
	}

	return (
		<div>
			<h1>Something is wrong</h1>
		</div>
	);
};
