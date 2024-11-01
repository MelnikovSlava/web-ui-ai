const PANEL_WIDTH_KEY = "left_panel_width";
const TOKEN = "token";
const SECRET = "secret";
const THEME = "theme";
const OPENROUTER_KEY = "openrouter_key";

export const localStorageUtils = {
	setPanelWidth: (width: number) => {
		localStorage.setItem(PANEL_WIDTH_KEY, width.toString());
	},

	getPanelWidth: (): number | null => {
		const width = localStorage.getItem(PANEL_WIDTH_KEY);
		return width ? Number.parseInt(width, 10) : null;
	},

	getKey: () => localStorage.getItem(OPENROUTER_KEY),
	setKey: (value: string) => localStorage.setItem(OPENROUTER_KEY, value),
	removeToken: () => localStorage.removeItem(TOKEN),
	getToken: () => localStorage.getItem(TOKEN),
	setToken: (value: string) => localStorage.setItem(TOKEN, value),
	getSecret: () => localStorage.getItem(SECRET),
	setSecret: (value: string) => localStorage.setItem(SECRET, value),
	setTheme: (value: string) => localStorage.setItem(THEME, value),
	getTheme: () => localStorage.getItem(THEME),
	clearAllSettings: () => localStorage.clear(),
};
