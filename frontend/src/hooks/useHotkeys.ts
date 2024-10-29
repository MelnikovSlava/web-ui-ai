import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router";
import { routes } from "../router";
import { useRootStore } from "../store/root.store";
import { usePromise } from "./usePromise";

export const useHotkeysGlobal = () => {
	const rootStore = useRootStore();
	const navigate = useNavigate();

	const onCreateWorkspace = usePromise({
		func: rootStore.createWorkspaceAction,
		resolve: ({ data }) => {
			navigate(routes.workspace(data.id));
		},
	});

	useHotkeys("alt+n", () => {
		onCreateWorkspace.promise();
	});
};
