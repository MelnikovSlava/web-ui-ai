import clsx from "clsx";
import "./index.css";
import { Main } from "./main/Main";
import { Panel as Side } from "./panel/Panel";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { useEffect, useState } from "react";
import { localStorageUtils } from "./utils/localStorage";

const App = () => {
	const [panelSize, setPanelSize] = useState(
		() => localStorageUtils.getPanelWidth() || 30,
	);

	useEffect(() => {
		document.body.setAttribute("data-theme", "gray");
	}, []);

	const handlePanelResize = (size: number) => {
		setPanelSize(size);
		localStorageUtils.setPanelWidth(size);
	};

	return (
		<PanelGroup
			direction="horizontal"
			className={clsx("bg-main-background text-white")}
		>
			<Panel
				defaultSize={panelSize}
				minSize={20}
				maxSize={50}
				onResize={handlePanelResize}
			>
				<Side />
			</Panel>
			<PanelResizeHandle className={clsx("w-[1px] bg-main-border")} />
			<Panel>
				<Main />
			</Panel>
		</PanelGroup>
	);
};

export default App;
