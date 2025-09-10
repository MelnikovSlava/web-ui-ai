import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { EllipsisVertical, LogOut, Settings, Box } from "lucide-react";
import { useNavigate } from "react-router";
import { useUrlWorkspaceId } from "../../../hooks/useUrlWorkspaceId";
import { useRootStore } from "../../../store/root.store";
import type { VitalProps } from "../../../utils/types";
import { routes } from "../../../router";
import { Accordion } from "./Accordion";
import { AddNewChatBtn } from "./AddNewChatBtn";
import { ChatItem } from "./ChatItem";
import { CreateNewWBtn } from "./CreateNewWBtn";
import { WorkspaceItem } from "./WorkspaceItem";
import { HoverWrapper } from "../../../ui-kit/HoverWrapper";

type PanelProps = {} & VitalProps;

export const Panel = observer((props: PanelProps) => {
	const rootStore = useRootStore();
	const urlWorkspaceId = useUrlWorkspaceId();
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleSettings = () => {
		navigate(routes.settings);
		handleMenuClose();
	};

	const handleModels = () => {
		navigate(routes.models);
		handleMenuClose();
	};

	const handleLogout = () => {
		const result = confirm("Are you sure you want to log out?");
		if (result) {
			rootStore.logout();
		}
		handleMenuClose();
	};

		return (
			<div
				className={clsx(
					"flex flex-col flex-1",
					"h-screen",
					"bg-[var(--panel-background)]",
				)}
			>
				<div className={clsx("flex-1", "overflow-auto", "p-4")}>
					{rootStore.workspaces.map((workspace) => (
						<Accordion
							key={workspace.data.id}
							title={<WorkspaceItem workspace={workspace} />}
							isOpen={urlWorkspaceId === workspace.data.id}
							onToggle={() => {}}
							className={clsx("pb-2")}
						>
							<div className={clsx("chat-list", "pt-1", "pl-1")}>
								{workspace.chats.map((chat) => (
									<ChatItem chat={chat} className="mb-1" key={chat.data.id} />
								))}
								<AddNewChatBtn workspace={workspace} />
							</div>
						</Accordion>
					))}
				</div>

				<div className={clsx("pt-4 flex items-center justify-between", "p-4")}>
						<HoverWrapper
							className={clsx("p-1")}
							onClick={handleMenuClick}
						>
							<EllipsisVertical size={20} />
						</HoverWrapper>
						<CreateNewWBtn />
				</div>

				<Menu
					id="settings-menu"
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={handleMenuClose}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
				>
					<MenuItem onClick={handleSettings}>
						<Settings size={16} className="mr-2" />
						Settings
					</MenuItem>
					<MenuItem onClick={handleModels}>
						<Box size={16} className="mr-2" />
						Models
					</MenuItem>
					<MenuItem onClick={handleLogout}>
						<LogOut size={16} className="mr-2" />
						Logout
					</MenuItem>
				</Menu>
			</div>
		);
});
