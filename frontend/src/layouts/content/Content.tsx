import clsx from "clsx";
import { Fragment } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Outlet } from "react-router";
import { usePanelSize } from "../../hooks/usePanelSize";
import { Panel as Side } from "./panel/Panel";
import { Sidebar } from "./Sidebar";
import { useMobile } from "../../hooks/useMobile";
import { MobileSidebar } from "./mobile/MobileSidebar";

export const Content = () => {
	const { handlePanelResize, panelSize } = usePanelSize();

	const isMobile = useMobile();

	if (isMobile) {
		return <Fragment>
			<MobileSidebar />
			<Outlet />
		</Fragment>
	}

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
};
