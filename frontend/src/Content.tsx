import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Outlet } from "react-router";
import { usePanelSize } from "./hooks/usePanelSize";
import { Panel as Side } from "./panel/Panel";
import { Sidebar } from "./sidebar/Sidebar";

export const Content = observer(() => {
	const { handlePanelResize, panelSize } = usePanelSize();

	return (
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
					<Outlet />
				</Panel>
			</PanelGroup>
		</Fragment>
	);
});
