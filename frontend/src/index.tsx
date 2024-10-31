import { ThemeProvider } from "@emotion/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { muiTheme } from "./utils/mui-theme";

import "./index.css";

const rootEl = document.getElementById("root");

if (rootEl) {
	const root = ReactDOM.createRoot(rootEl);

	root.render(
		<React.StrictMode>
			<ThemeProvider theme={muiTheme}>
				{/* <Suspense fallback={<FirstLoader fadeIn />}> */}
				<RouterProvider router={router} />
				{/* </Suspense> */}
			</ThemeProvider>
			,
		</React.StrictMode>,
	);
}