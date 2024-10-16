import type React from "react";
import { FC, useState } from "react";
import type { VitalProps } from "../../utils/types";
import { FormControl, FormLabel } from "@mui/joy";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {
	getTheme,
	setTheme as setGlobalTheme,
	Themes,
	type Theme,
} from "../../utils/theme";

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
				onChange={(e, value) => handleChange(value || "default")}
			>
				{items.map((item) => {
					return (
						<Option key={item.value} value={item.value}>
							{item.label}
						</Option>
					);
				})}
			</Select>
		</FormControl>
	);
};
