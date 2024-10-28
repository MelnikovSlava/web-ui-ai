import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useUrlWorkspaceId } from "../hooks/useUrlWorkspaceId";
import { useRootStore } from "../store/root.store";
import { Accordion } from "./Accordion";
import { AddNewChatBtn } from "./AddNewChatBtn";
import { ChatItem } from "./ChatItem";
import { CreateNewWBtn } from "./CreateNewWBtn";
import { WorkspaceItem } from "./WorkspaceItem";

export const Panel = observer(() => {
	const rootStore = useRootStore();
	const urlWorkspaceId = useUrlWorkspaceId();

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
				{rootStore.allWorkspaces.map((workspace) => (
					<Accordion
						key={workspace.id}
						title={<WorkspaceItem workspace={workspace} />}
						isOpen={urlWorkspaceId === workspace.id}
						onToggle={() => {}}
						className={clsx("pb-2")}
					>
						<div className={clsx("chat-list", "pt-1", "pl-1")}>
							{workspace.chats.map((chat) => (
								<ChatItem chat={chat} className="mb-1" key={chat.id} />
							))}
							<AddNewChatBtn workspace={workspace} />
						</div>
					</Accordion>
				))}

				<CreateNewWBtn />

				{/* {rootStore.workspaces.size === 0 && <NoWorkspaces className={clsx("mt-2")} />} */}
			</div>
		</div>
	);
});
