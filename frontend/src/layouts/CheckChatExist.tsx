import { Outlet, useNavigate } from "react-router";
import { useUrlChatId } from "../hooks/useUrlChatId";
import { useUrlWorkspaceId } from "../hooks/useUrlWorkspaceId";
import { routes } from "../router";
import { useRootStore } from "../store/root.store";
import type { VitalProps } from "../utils/types";

export default function CheckChatExist(props: VitalProps) {
	const navigate = useNavigate();
	const rootStore = useRootStore();
	const workspaceId = useUrlWorkspaceId();
	const chatId = useUrlChatId();
	const existWorkspace = rootStore.existsWorkspace(workspaceId);

	if (existWorkspace) {
		const workspace = rootStore.getWorkspace(workspaceId);
		const existsChat = workspace.existsChat(chatId);

		if (existsChat) {
			return <Outlet />;
		}
		navigate(routes.workspace(workspaceId), { replace: true });
	} else {
		navigate(routes.root, { replace: true });
	}

	return null;
}
