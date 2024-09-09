import { useEffect } from "react";
import { localStorageUtils } from "./localStorage";

export type Theme = "ocean" | "default";

export function getTheme(): Theme {
  return (localStorageUtils.getTheme() as Theme) || "default";
}

export function setTheme(theme: Theme = "default") {
  localStorageUtils.setTheme(theme);
  document.body.setAttribute("data-theme", theme);
}

export function useSetTheme() {
  useEffect(() => {
    const theme = getTheme();
    setTheme(theme);
  }, []);
}
