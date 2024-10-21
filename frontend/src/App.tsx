import clsx from "clsx";
import { Main } from "./main/Main";
import { Panel as Side } from "./panel/Panel";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { Fragment, useEffect, useState } from "react";
import { localStorageUtils } from "./utils/localStorage";
import { useSetTheme } from "./utils/theme";
import { Sidebar } from "./sidebar/Sidebar";
import { useHotkeysGlobal } from "./hooks/useHotkeys";
import { CircularProgress } from "@mui/joy";
import { useRootStore } from "./store/root.store";
import { delayPromise } from "./utils/utils";

const App = () => {
	const [panelSize, setPanelSize] = useState(
		() => localStorageUtils.getPanelWidth() || 30,
	);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const store = useRootStore();

	useSetTheme();
	useHotkeysGlobal();

	const handlePanelResize = (size: number) => {
		setPanelSize(size);
		localStorageUtils.setPanelWidth(size);
	};

	useEffect(() => {
		if (!store.settingsStore.token) {
			const key = prompt('OpenRouter key:');

			if (key) {
				store.settingsStore.setToken(key);
			}
		}

		const fetch = store.aiStore.fetchModels();

		delayPromise(fetch).then(() => {
			setIsLoading(false);
		});
	}, []);

	return (
		<div
			className={clsx(
				"flex h-full",
				"bg-[var(--main-background)] text-[var(--main-color-text)]",
				"border-t-[var(--main-border)] border-t",
			)}
		>
			{isLoading ? <CircularProgress className={clsx('!mx-auto self-center')} /> :
				<Fragment>
					<Sidebar />
					<PanelGroup direction="horizontal">
						<Panel
							defaultSize={panelSize}
							minSize={5}
							maxSize={30}
							onResize={handlePanelResize}
						>
							<Side />
						</Panel>
						<PanelResizeHandle
							className={clsx("w-[1px] bg-[var(--main-border)]")}
						/>
						<Panel>
							<Main />
						</Panel>
					</PanelGroup>
				</Fragment>
			}
		</div>
	);
};

export default App;
