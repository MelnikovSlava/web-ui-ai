import { Navigate, Outlet } from "react-router";
import { useUrlChatId } from "../hooks/useUrlChatId";
import { useUrlWorkspaceId } from "../hooks/useUrlWorkspaceId";
import { routes } from "../router";
import { useRootStore } from "../store/root.store";
import type { VitalProps } from "../utils/types";
import { useCreateChatHotkey } from "../hooks/hotkeys/useCreateChatHotkey";

export default function CheckChatExist(props: VitalProps) {
	const rootStore = useRootStore();
	const workspaceId = useUrlWorkspaceId();
	const chatId = useUrlChatId();
	const existWorkspace = rootStore.existsWorkspace(workspaceId);

	useCreateChatHotkey();

	if (existWorkspace) {
		const workspace = rootStore.getWorkspace(workspaceId);
		const existsChat = workspace.existsChat(chatId);

		if (existsChat) {
			return <Outlet />;
		}

		return <Navigate to={routes.workspace(workspaceId)} replace />;
	}

	return <Navigate to={routes.root} replace />;
}
