import { useState } from "react";
import { localStorageUtils } from "../utils/localStorage";

export const usePanelSize = () => {
	const [panelSize, setPanelSize] = useState(
		() => localStorageUtils.getPanelWidth() || 30,
	);

	const handlePanelResize = (size: number) => {
		setPanelSize(size);
		localStorageUtils.setPanelWidth(size);
	};

	return { panelSize, handlePanelResize };
};
