import { observer } from "mobx-react-lite";
import type React from "react";
import { useRootStore } from "../../store/root.store";
import type { VitalProps } from "../../utils/types";
import { FormControl, FormLabel, TextField } from "@mui/material";

type InputTokenProps = {} & VitalProps;

export const InputToken = observer((props: InputTokenProps) => {
	const storeGlobal = useRootStore();
	const storeSettings = storeGlobal.settingsStore;

	const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		storeSettings.setKey(e.target.value);
	};

	return (
		<FormControl>
			<FormLabel sx={{ color: "inherit" }}>Openrouter key</FormLabel>
			<TextField value={storeSettings.key} onChange={handleTokenChange} />
		</FormControl>
	);
});
