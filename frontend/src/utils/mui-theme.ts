import { createTheme } from "@mui/material/styles";

declare module '@mui/material/styles' {
	interface BreakpointOverrides {
		w800: true;
	}
}

export const muiTheme = createTheme({
	palette: {
		// mode: "dark",
		primary: {
			main: "#D7BA7D", // Zinc-900
			// main: "#18181b", // Zinc-900
			// light: "#27272a", // Zinc-800
			// dark: "#09090b", // Zinc-950
		},
		// background: {
		// 	default: "#ffffff",
		// 	paper: "#ffffff",
		// },
		text: {
			primary: "#D1D7E0",
			// secondary: "#71717a", // Zinc-500
		},
	},
	typography: {
		// fontFamily: 'var(--font-sans)', // или другой предпочитаемый шрифт
		button: {
			textTransform: "none",
			fontWeight: 500,
		},
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 900,
			w800: 800,
			lg: 1200,
			xl: 1536,
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					boxShadow: "none",
					borderRadius: "6px",
					padding: "8px 16px",
					fontSize: "14px",
					lineHeight: "20px",
					transition: "all 0.2s",

					"&:hover": {
						boxShadow: "none",
						backgroundColor: "#27272a",
						opacity: 0.9,
					},
				},
				contained: {
					backgroundColor: "#18181b",
					color: "#ffffff",
					"&:hover": {
						backgroundColor: "#27272a",
					},
				},
				outlined: {
					borderColor: "#e4e4e7", // Zinc-200
					color: "#18181b",
					"&:hover": {
						backgroundColor: "#f4f4f5", // Zinc-100
						borderColor: "#e4e4e7",
					},
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-root": {
						borderRadius: "6px",
						backgroundColor: "transparent",
						"& fieldset": {
							// borderColor: "#e4e4e7",
						},
						"&:hover fieldset": {
							// borderColor: "#a1a1aa", // Zinc-400
						},
						"&.Mui-focused fieldset": {
							// borderColor: "#18181b",
							// borderWidth: "1px",
						},
					},
					"& .MuiInputBase-input": {
						padding: "8px 12px",
						fontSize: "14px",
						lineHeight: "20px",
					},
				},
			},
		},
		MuiTabs: {
			styleOverrides: {
				root: {
					minHeight: "40px",
					borderBottom: "1px solid #e4e4e7",
				},
				indicator: {
					backgroundColor: "#18181b",
					height: "2px",
				},
			},
		},
		MuiTab: {
			styleOverrides: {
				root: {
					textTransform: "none",
					minHeight: "40px",
					padding: "8px 12px",
					fontSize: "14px",
					fontWeight: 500,
					color: "#71717a",
					"&.Mui-selected": {
						color: "#18181b",
					},
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				root: {
					borderRadius: "6px",
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: "#e4e4e7",
					},
					"&:hover .MuiOutlinedInput-notchedOutline": {
						borderColor: "#a1a1aa",
					},
					"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
						borderColor: "#18181b",
						borderWidth: "1px",
					},
				},
				select: {
					padding: "8px 12px",
					fontSize: "14px",
					lineHeight: "20px",
				},
			},
		},
		MuiMenu: {
			styleOverrides: {
				paper: {
					borderRadius: "6px",
					marginTop: "8px",
					boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					fontSize: "14px",
					padding: "8px 12px",
					"&:hover": {
						backgroundColor: "#f4f4f5",
					},
					"&.Mui-selected": {
						backgroundColor: "#f4f4f5",
						"&:hover": {
							backgroundColor: "#e4e4e7",
						},
					},
				},
			},
		},
	},
});

export type Theme = typeof muiTheme;
