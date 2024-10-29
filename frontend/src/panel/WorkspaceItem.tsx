import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { IoIosSettings } from "react-icons/io";
import { RiApps2Fill } from "react-icons/ri";
import { RiApps2Line } from "react-icons/ri";
import { useNavigate } from "react-router";
import { useUrlWorkspaceId } from "../hooks/useUrlWorkspaceId";
import { routes } from "../router";
import type { WorkspaceStore } from "../store/workspace.store";
import { IconWrapper } from "../ui-kit/IconWrapper";
import { INIT_WORKSPACE_TITLE } from "../utils/constants";
import type { VitalProps } from "../utils/types";

type WorkspaceItemProps = {
	workspace: WorkspaceStore;
} & VitalProps;

export const WorkspaceItem = observer((props: WorkspaceItemProps) => {
	const navigate = useNavigate();
	const workspaceStore = props.workspace;

	const urlWorkspaceId = useUrlWorkspaceId();

	const isActive = workspaceStore.data.id === urlWorkspaceId;

	const openWorkspace = (workspaceId: number) => {
		if (isActive) {
			return;
		}

		let route = routes.workspace(workspaceId);

		const targetWorkspace = workspaceStore.root.getWorkspace(workspaceId);
		const chatsTargetWorkspace = targetWorkspace.chats;
		const lastChatTargetWorkspace =
			chatsTargetWorkspace[chatsTargetWorkspace.length - 1];

		if (lastChatTargetWorkspace) {
			route = routes.chat(workspaceId, lastChatTargetWorkspace.data.id);
		}

		navigate(route);
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
						navigate(routes.settingsWorkspace(workspaceStore.data.id));
					}}
				>
					<IoIosSettings size={18} />
				</IconWrapper>
			</div>
		</div>
	);
});
