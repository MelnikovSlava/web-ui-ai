import React, { FC } from "react";
import clsx from "clsx";
import { VitalProps } from "../utils/types";
import { Workspace } from "../store/types";
import { useGlobalStore } from "../store/global.store";
import { IoIosSettings } from "react-icons/io";
import { observer } from "mobx-react-lite";
import { RiApps2Fill } from "react-icons/ri";
import { RiApps2Line } from "react-icons/ri";

type WorkspaceItemProps = {
	workspace: Workspace;
} & VitalProps;

export const WorkspaceItem = observer((props: WorkspaceItemProps) => {
	const storeGlobal = useGlobalStore();
	const { id, name } = props.workspace;
	const isActive = id === storeGlobal.openWorkspaceId;

	const openWorkspace = (wId: number) => {
		storeGlobal.selectWorkspace(wId);
	};

	return (
		<div
			onClick={() => openWorkspace(id)}
			className={clsx(
				isActive ? "bg-workspace-active" : "opacity-70",
				"border-workspace-active border",
				"flex items-center",
				"p-2",
				"rounded-lg",
				"select-none",
				"cursor-pointer",
				"group/item",
				props.className,
			)}
		>
			{isActive ? <RiApps2Fill /> : <RiApps2Line />}
			<span className={clsx("ml-2", "flex-1", "line-clamp-1")}>{name}</span>

			<IoIosSettings
				size={20}
				className={clsx(
					"opacity-0 group-hover/item:opacity-80 hover:opacity-100",
				)}
				onClick={(e) => {
					e.stopPropagation();
					storeGlobal.setOpenWorkspaceSettings(id);
				}}
			/>
		</div>
	);
});
