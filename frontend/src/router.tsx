import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { Content } from "./Content";
import { Root } from "./Root";
import { Auth } from "./auth/Auth";
import { AuthRequired } from "./layouts/AuthRequired";
import { Chat } from "./main/message-list/Chat";
import { Settings } from "./main/settings/Settings";
import { WorkspaceSettings } from "./main/workspace-settings/WorkspaceSettings";

export const routes = {
	root: "/",
	auth: "/auth",

	workspace: (workspaceId: any = ":workspaceId") => `/workspace/${workspaceId}`,
	chat: (workspaceId: any = ":workspaceId", chatId: any = ":chatId") =>
		`/workspace/${workspaceId}/chat/${chatId}`,
	settingsWorkspace: (id: any = ":workspaceId") => `/workspace/${id}/settings`,

	settings: "/settings",
};

export const router = createBrowserRouter([
	{
		element: <Root />,
		// errorElement: <ErrorAppHandler />,
		children: [
			{
				path: routes.auth,
				element: <Auth />,
			},
			{
				element: <AuthRequired />,
				children: [
					{
						element: <App />,
						children: [
							{
								path: routes.root,
								element: <Content />,
							},
							{
								path: routes.workspace(),
								element: <Content />,
								children: [
									{
										path: routes.chat(),
										element: <Chat />,
									},
									{
										path: routes.settingsWorkspace(),
										element: <WorkspaceSettings />,
									},
								],
							},
							{
								element: <Content />,
								children: [
									{
										path: routes.settings,
										element: <Settings />,
									},
								],
							},
						],
					},
				],
			},
		],
	},
]);
