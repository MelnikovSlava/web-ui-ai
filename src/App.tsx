import clsx from "clsx";
import "./index.css";
import { Main } from "./main/Main";
import { Panel as Side } from "./panel/Panel";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { useEffect, useState } from "react";
import { localStorageUtils } from "./utils/localStorage";
import { useSetTheme } from "./utils/theme";
import { Sidebar } from "./sidebar/Sidebar";
import { useHotkeysGlobal } from "./hooks/useHotkeys";

const App = () => {
	const [panelSize, setPanelSize] = useState(
		() => localStorageUtils.getPanelWidth() || 30,
	);

	useSetTheme();
	useHotkeysGlobal();

	const handlePanelResize = (size: number) => {
		setPanelSize(size);
		localStorageUtils.setPanelWidth(size);
	};

	return (
		<div
			className={clsx(
				"flex h-full",
				"bg-main-background text-white",
				"border-t-main-border border-t",
			)}
		>
			<Sidebar />
			<PanelGroup direction="horizontal">
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
		</div>
	);
};

export default App;
