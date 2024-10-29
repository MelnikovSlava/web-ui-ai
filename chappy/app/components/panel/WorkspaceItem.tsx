"use client";

import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { IoIosSettings } from "react-icons/io";
import { RiApps2Fill } from "react-icons/ri";
import { RiApps2Line } from "react-icons/ri";
import { useUrlWorkspaceId } from "../../hooks/useUrlWorkspaceId";
import { routes } from "../../routers";
import type { WorkspaceStore } from "../../store/workspace.store";
import { INIT_WORKSPACE_TITLE } from "../../utils/constants";
import type { VitalProps } from "../../utils/types";
import { IconWrapper } from "../ui-kit/IconWrapper";

type WorkspaceItemProps = {
	workspace: WorkspaceStore;
} & VitalProps;

export const WorkspaceItem = observer((props: WorkspaceItemProps) => {
	const router = useRouter();
	const workspaceStore = props.workspace;

	const urlWorkspaceId = useUrlWorkspaceId();

	const isActive = workspaceStore.data.id === urlWorkspaceId;

	const openWorkspace = (workspaceId: number) => {
		if (isActive) {
			return;
		}

		let route = routes.workspace(workspaceId);

		const targetWorkspace = workspaceStore.root.getWorkspace(workspaceId);
		if (!targetWorkspace) {
			throw new Error("targetWorkspace not found");
		}
		const chatsTargetWorkspace = targetWorkspace.chats;
		const lastChatTargetWorkspace =
			chatsTargetWorkspace[chatsTargetWorkspace.length - 1];

		if (lastChatTargetWorkspace) {
			route = routes.chat(workspaceId, lastChatTargetWorkspace.data.id);
		}

		router.push(route);
	};

	return (
		<div
			onClick={() => openWorkspace(workspaceStore.data.id)}
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
			<span className={clsx("ml-2", "flex-1", "line-clamp-1")}>
				{workspaceStore.data.name || INIT_WORKSPACE_TITLE}
			</span>

			<div className={clsx("opacity-0 group-hover/item:opacity-80")}>
				<IconWrapper
					onClick={(e) => {
						e.stopPropagation();
						router.push(routes.settingsWorkspace(workspaceStore.data.id));
					}}
				>
					<IoIosSettings size={18} />
				</IconWrapper>
			</div>
		</div>
	);
});
