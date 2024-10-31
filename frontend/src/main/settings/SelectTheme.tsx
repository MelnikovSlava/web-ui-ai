import { FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import {
	type Theme,
	Themes,
	getTheme,
	setTheme as setGlobalTheme,
} from "../../utils/theme";
import type { VitalProps } from "../../utils/types";

type SelectThemeProps = {} & VitalProps;

export const SelectTheme = (props: SelectThemeProps) => {
	const [theme, setTheme] = useState<Theme>(() => getTheme());

	const items = Themes.map((item) => {
		return {
			value: item,
			label: item.charAt(0).toUpperCase() + item.slice(1),
		};
	});

	const handleChange = (theme: Theme) => {
		setTheme(theme);
		setGlobalTheme(theme);
	};

	return (
		<FormControl>
			<FormLabel sx={{ color: "inherit" }}>Theme</FormLabel>
			<Select
				value={theme}
				variant="outlined"
				onChange={(e) => {
					const value = (e.target.value as Theme) || "default";
					handleChange(value);
				}}
			>
				{items.map((item) => {
					return (
						<MenuItem key={item.value} value={item.value}>
							{item.label}
						</MenuItem>
					);
				})}
			</Select>
		</FormControl>
	);
};
