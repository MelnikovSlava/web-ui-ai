import React, { FC } from "react";
import clsx from "clsx";
import { VitalProps } from "../utils/types";
import { Workspace } from "../store/types";
import { useGlobalStore } from "../store/global.store";
import { IoIosSettings } from "react-icons/io";
import { observer } from "mobx-react-lite";
import { RiApps2Fill } from "react-icons/ri";
import { RiApps2Line } from "react-icons/ri";
import { IconWrapper } from "../ui-kit/IconWrapper";

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
				isActive ? "bg-[var(--workspace-active)]" : "opacity-70",
				"border-[var(--workspace-active)] border",
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

			<div className={clsx('opacity-0 group-hover/item:opacity-80')}>
				<IconWrapper
					onClick={(e) => {
						e.stopPropagation();
						storeGlobal.setOpenWorkspaceSettings(id);
					}}
				>
					<IoIosSettings
						size={18}
					/>
				</IconWrapper>
			</div>
		</div>
	);
});
