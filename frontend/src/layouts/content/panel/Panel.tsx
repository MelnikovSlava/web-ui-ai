import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useUrlWorkspaceId } from "../../../hooks/useUrlWorkspaceId";
import { useRootStore } from "../../../store/root.store";
import type { VitalProps } from "../../../utils/types";
import { Accordion } from "./Accordion";
import { AddNewChatBtn } from "./AddNewChatBtn";
import { ChatItem } from "./ChatItem";
import { CreateNewWBtn } from "./CreateNewWBtn";
import { WorkspaceItem } from "./WorkspaceItem";

type PanelProps = {} & VitalProps;

export const Panel = observer((props: PanelProps) => {
	const rootStore = useRootStore();
	const urlWorkspaceId = useUrlWorkspaceId();

	return (
		<div
			className={clsx(
				"flex flex-col flex-1",
				"p-4",
				"h-screen",
				"overflow-auto",
				"bg-[var(--panel-background)]",
			)}
		>
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

			<CreateNewWBtn />
		</div>
	);
});
