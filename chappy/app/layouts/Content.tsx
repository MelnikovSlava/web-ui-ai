'use client';

import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Panel as Side } from "../components/panel/Panel";
import { Sidebar } from "../components/sidebar/Sidebar";
import { usePanelSize } from "../hooks/usePanelSize";

export const Content = observer((props: any) => {
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
				<Panel>{props.children}</Panel>
			</PanelGroup>
		</Fragment>
	);
});
