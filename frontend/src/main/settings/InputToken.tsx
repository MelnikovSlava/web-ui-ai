import { FormControl, FormLabel, Input } from "@mui/joy";
import { observer } from "mobx-react-lite";
import type React from "react";
import {} from "react";
import { useRootStore } from "../../store/root.store";
import type { VitalProps } from "../../utils/types";

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
			<Input value={storeSettings.key} onChange={handleTokenChange} />
		</FormControl>
	);
});
