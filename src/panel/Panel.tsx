import React, { FC } from "react";
import clsx from "clsx";
import { useGlobalStore } from "../store/global.store";
import { CreateNewWBtn } from "./CreateNewWBtn";
import { AddNewChatBtn } from "./AddNewChatBtn";
import { ChatItem } from "./ChatItem";
import { WorkspaceItem } from "./WorkspaceItem";
import { observer } from "mobx-react-lite";
import { Accordion } from "./Accordion";
import { IoMdSettings } from "react-icons/io";

export const Panel = observer(() => {
	const store = useGlobalStore();

	const handleToggle = (id: number) => {
		// storeGlobal.openWorkspaceId();
	};

	const workspaces = [...store.workspaces.values()];

	return (
		<div className={clsx("flex flex-col", "p-4", "h-screen", "overflow-auto")}>
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
									key={chat.chat.id}
									workspaceId={w.workspace.id}
								/>
							))}
							<AddNewChatBtn onClick={w.createNewChat} />
						</div>
					</Accordion>
				))}
			</div>

			<div className={clsx("flex items-center")}>
				<CreateNewWBtn
					onClick={store.createNewWorkspace}
					className={clsx("")}
				/>
				<IoMdSettings onClick={() => store.setView("settings")} />
			</div>
		</div>
	);
});
