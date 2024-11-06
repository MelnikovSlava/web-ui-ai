import { createHashRouter } from "react-router-dom";
import { Auth } from "./auth/Auth";
import { KeyForm } from "./key/KeyForm";
import { AuthRedirect } from "./layouts/AuthRedirect";
import { AuthRequired } from "./layouts/AuthRequired";
import CheckChatExist from "./layouts/CheckChatExist";
import CheckWorkspaceExist from "./layouts/CheckWorkspaceExist";
import { DataFetcher } from "./layouts/DataFetcher";
import { ErrorAppHandler } from "./layouts/ErrorAppHandler";
import { KeyHandler } from "./layouts/KeyHandler";
import { KeyRedirect } from "./layouts/KeyRedirect";
import { Root } from "./layouts/Root";
import { Content } from "./layouts/content/Content";
import { Chat } from "./main/message-list/Chat";
import { Settings } from "./main/settings/Settings";
import { WorkspaceSettings } from "./main/workspace-settings/WorkspaceSettings";

export const routes = {
	root: "/",
	auth: "/auth",
	key: "/key",

	workspace: (wId: any = ":workspaceId") => `/workspace/${wId}`,
	chat: (wId: any = ":workspaceId", cId: any = ":chatId") =>
		`/workspace/${wId}/chat/${cId}`,
	settingsWorkspace: (wId: any = ":workspaceId") =>
		`/workspace/${wId}/settings`,

	settings: "/settings",
};

export const router = createHashRouter([
	{
		element: <Root />,
		errorElement: <ErrorAppHandler />,
		children: [
			{
				element: <AuthRedirect />,
				children: [
					{
						path: routes.auth,
						element: <Auth />,
					},
				],
			},
			{
				element: <AuthRequired />,
				children: [
					{
						element: <KeyRedirect />,
						children: [
							{
								path: routes.key,
								element: <KeyForm />,
							},
						],
					},
					{
						element: <KeyHandler />,
						children: [
							{
								element: <DataFetcher />,
								children: [
									{
										path: routes.root,
										element: <Content />,
										children: [
											{
												path: routes.settings,
												element: <Settings />,
											},
											{
												path: routes.workspace(),
												element: <CheckWorkspaceExist />,
												children: [
													{
														path: routes.chat(),
														element: <CheckChatExist />,
														children: [
															{
																path: routes.chat(),
																element: <Chat />,
															},
														],
													},
													{
														path: routes.settingsWorkspace(),
														element: <WorkspaceSettings />,
													},
												],
											},
										],
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
