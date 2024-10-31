import { useRootStore } from "../store/root.store";
import { useUrlChatId } from "./useUrlChatId";
import { useUrlWorkspaceId } from "./useUrlWorkspaceId";

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
