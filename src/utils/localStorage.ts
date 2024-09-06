const PANEL_WIDTH_KEY = "left_panel_width";
const TOKEN = "token";

export const localStorageUtils = {
  setPanelWidth: (width: number) => {
    localStorage.setItem(PANEL_WIDTH_KEY, width.toString());
  },

  getPanelWidth: (): number | null => {
    const width = localStorage.getItem(PANEL_WIDTH_KEY);
    return width ? Number.parseInt(width, 10) : null;
  },

  getToken: () => {
    return localStorage.getItem(TOKEN);
  },

  setToken: (value: string) => {
    return localStorage.setItem(TOKEN, value);
  },

  clearAllSettings: () => {
    localStorage.clear();
  },
};
