'use client';

import { isRouteErrorResponse, useRouteError } from "react-router";

export const ErrorAppHandler = () => {
	const error = useRouteError();

	let desc = "Something went wrong";

	if (error instanceof Response || isRouteErrorResponse(error)) {
		if (error.status === 401) {
			// return <Navigate to={routes.authStart} />;
		}

		if (error.status === 404) {
			//TODO: this page not found mock with home button
			// return <Navigate to={routes.authStart} />;
			// desc = "This page doesn't exist!";
		}

		if (error.status >= 500) {
			desc = "Looks like our server is down";
		}
	}

	// return <ErrorMock desc={desc} center />;
	return null;
};
