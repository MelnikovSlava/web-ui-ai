import { observer } from "mobx-react-lite";
import type React from "react";
import { useRootStore } from "../../store/root.store";
import type { VitalProps } from "../../utils/types";
import { FormControl, FormLabel, TextField, InputAdornment, IconButton } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { localStorageUtils } from "../../utils/localStorage";

type InputTokenProps = {} & VitalProps;

export const InputToken = observer((props: InputTokenProps) => {
	const storeGlobal = useRootStore();
	const storeSettings = storeGlobal.settingsStore;
	const [showToken, setShowToken] = useState(false);

	const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		storeSettings.setKey(value);
		localStorageUtils.setKey(value);
	};

	const toggleTokenVisibility = () => {
		setShowToken(!showToken);
	};

	return (
		<FormControl className="w-full">
			<FormLabel sx={{ color: "inherit", marginBottom: "8px", fontWeight: 600 }}>
				OpenRouter API Key
			</FormLabel>
			<TextField
				value={storeSettings.key}
				onChange={handleTokenChange}
				type={showToken ? "text" : "password"}
				variant="outlined"
				fullWidth
				placeholder="Enter your OpenRouter API key"
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={toggleTokenVisibility}
								edge="end"
								size="small"
								sx={{ color: "var(--text-secondary)" }}
							>
								{showToken ? <EyeOff size={18} /> : <Eye size={18} />}
							</IconButton>
						</InputAdornment>
					),
				}}
				sx={{
					"& .MuiOutlinedInput-root": {
						backgroundColor: "var(--bg-secondary)",
						borderRadius: "8px",
						"&:hover fieldset": {
							borderColor: "var(--primary)",
						},
						"&.Mui-focused fieldset": {
							borderColor: "var(--primary)",
						},
					},
				}}
			/>
			<p className="text-sm text-[var(--text-secondary)] mt-2">
				Your API key is stored locally and never shared with anyone.
			</p>
		</FormControl>
	);
});
