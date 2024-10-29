"use client";

import { useHotkeys } from "react-hotkeys-hook";
// import { routes } from "../router";
import { useRootStore } from "../store/root.store";
import { usePromise } from "./usePromise";
// import { redirect } from "next/navigation";

export const useHotkeysGlobal = () => {
	const rootStore = useRootStore();
	// const navigate = useNavigate();

	const onCreateWorkspace = usePromise({
		func: rootStore.createWorkspaceAction,
		resolve: (response) => {
			// navigate(routes.workspace(response?.data.id));
		},
	});

	useHotkeys("alt+n", () => {
		onCreateWorkspace.promise();
	});
};
