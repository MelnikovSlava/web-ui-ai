import { useNavigate } from "react-router";
import { routes } from "../router";
import { useGetWorkspace } from "./useGetWorkspace";
import { usePromise } from "./usePromise";

export function useCreateChat() {
	const navigate = useNavigate();
	const workspace = useGetWorkspace();

	const onCreateChat = usePromise({
		func: workspace.createChatAction,
		resolve: (response) => {
			navigate(routes.chat(workspace.data.id, response?.data.id));
		},
	});

	return { onCreateChat };
}
