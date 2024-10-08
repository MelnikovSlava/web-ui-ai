import React, { FC } from "react";
import clsx from "clsx";
import { useRootStore } from "../store/root.store";
import { CreateNewWBtn } from "./CreateNewWBtn";
import { AddNewChatBtn } from "./AddNewChatBtn";
import { ChatItem } from "./ChatItem";
import { WorkspaceItem } from "./WorkspaceItem";
import { observer } from "mobx-react-lite";
import { Accordion } from "./Accordion";
import { IoMdSettings } from "react-icons/io";
import { NoWorkspaces } from "./NoWorkspaces";
import { Stepper, Step } from "@mui/joy";

export const Panel = observer(() => {
	const store = useRootStore();

	const handleToggle = (id: number) => {
		// storeGlobal.openWorkspaceId();
	};

	const workspaces = [...store.workspaces.values()];

	return (
		<div
			className={clsx(
				"flex flex-col",
				"p-4",
				"h-screen",
				"overflow-auto",
				"bg-[var(--panel-background)]",
			)}
		>
			<div className={clsx("panel-list flex-1")}>
				{workspaces.map((w) => (
					<Accordion
						key={w.workspace.id}
						title={<WorkspaceItem workspace={w.workspace} />}
						isOpen={store.openWorkspaceId === w.workspace.id}
						onToggle={() => handleToggle(w.workspace.id)}
						className={clsx("pb-2")}
					>
						<div className={clsx("chat-list", "pt-1", "pl-1")}>
							{[...w.chats.values()].map((chat) => (
								<ChatItem
									chat={chat}
									className="mb-1"
									key={chat.chat.id}
									workspaceId={w.workspace.id}
								/>
							))}
							<AddNewChatBtn onClick={w.createNewChat} />
						</div>
					</Accordion>
				))}
				{workspaces.length === 0 && <NoWorkspaces className={clsx("mt-2")} />}
			</div>
		</div>
	);
});
