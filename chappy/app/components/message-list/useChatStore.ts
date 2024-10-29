'use client';

import { useUrlChatId } from "../../hooks/useUrlChatId";
import { useUrlWorkspaceId } from "../../hooks/useUrlWorkspaceId";
import { useRootStore } from "../../store/root.store";

export const useChatStore = () => {
	const storeGlobal = useRootStore();
	const urlWorkspaceId = useUrlWorkspaceId();
	const urlChatId = useUrlChatId();
	const chatStore = storeGlobal.getChat(urlWorkspaceId, urlChatId);

	if (!chatStore) {
		throw new Error("Chat store not found");
	}

	return chatStore;
};
