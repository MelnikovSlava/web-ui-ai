import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import { Theme } from "../utils/mui-theme";

export function useMobile() {
  const theme = useTheme() as Theme;
  const matches = useMediaQuery(theme.breakpoints.down('w800'));

  return matches
}