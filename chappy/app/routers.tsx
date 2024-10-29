type Param = string | number;

export const routes = {
	root: "/",
	auth: "/auth",
	home: "/home",

	workspace: (wId: Param) => `/workspace/${wId}`,
	chat: (wId: Param, cId: Param) => `/workspace/${wId}/chat/${cId}`,
	settingsWorkspace: (wId: Param) => `/workspace/${wId}/settings`,

	settings: "/settings",
};
