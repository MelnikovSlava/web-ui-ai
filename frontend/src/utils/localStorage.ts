const PANEL_WIDTH_KEY = "left_panel_width";
const TOKEN = "token";
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

	getKey: () => {
		return localStorage.getItem(OPENROUTER_KEY);
	},

	setKey: (value: string) => {
		return localStorage.setItem(OPENROUTER_KEY, value);
	},

	removeToken: () => {
		return localStorage.removeItem(TOKEN);
	},

	getToken: () => {
		return localStorage.getItem(TOKEN);
	},

	setToken: (value: string) => {
		return localStorage.setItem(TOKEN, value);
	},

	setTheme: (value: string) => {
		return localStorage.setItem(THEME, value);
	},

	getTheme: () => {
		return localStorage.getItem(THEME);
	},

	clearAllSettings: () => {
		localStorage.clear();
	},
};
