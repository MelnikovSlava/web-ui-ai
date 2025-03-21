import { Navigate, Outlet } from "react-router";
import { useUrlWorkspaceId } from "../hooks/useUrlWorkspaceId";
import { routes } from "../router";
import { useRootStore } from "../store/root.store";
import type { VitalProps } from "../utils/types";

export default function CheckWorkspaceExist(props: VitalProps) {
	const rootStore = useRootStore();
	const workspaceId = useUrlWorkspaceId();
	const exist = rootStore.existsWorkspace(workspaceId);

	if (!exist) {
		return <Navigate to={routes.root} replace />;
	}

	return <Outlet />;
}
