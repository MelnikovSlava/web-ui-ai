import { useRootStore } from "../store/root.store";
import { useUrlWorkspaceId } from "./useUrlWorkspaceId";

export const useGetWorkspace = () => {
	const rootStore = useRootStore();
	const workspaceId = useUrlWorkspaceId();
	const workspace = rootStore.getWorkspace(workspaceId);

	return workspace;
};
