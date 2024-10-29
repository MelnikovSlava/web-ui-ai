"use client";

import { Chat } from "@/components/message-list/Chat";
import { redirect } from "next/navigation";
import { useUrlChatId } from "../../../../../hooks/useUrlChatId";
import { useUrlWorkspaceId } from "../../../../../hooks/useUrlWorkspaceId";
import { routes } from "../../../../../routers";
import { useRootStore } from "../../../../../store/root.store";

export default function ChatPage() {
	const rootStore = useRootStore();
	const workspaceId = useUrlWorkspaceId();
	const chatId = useUrlChatId();
	const existWorkspace = rootStore.existsWorkspace(workspaceId);

	if (existWorkspace) {
		const workspace = rootStore.getWorkspace(workspaceId);
		const existsChat = workspace.existsChat(chatId);

		if (existsChat) {
			return <Chat />;
		}

		redirect(routes.workspace(workspaceId));
	} else {
		redirect(routes.home);
	}
}
