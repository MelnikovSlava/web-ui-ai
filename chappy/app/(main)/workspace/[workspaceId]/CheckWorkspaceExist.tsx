import { redirect } from "next/navigation";
import { useUrlWorkspaceId } from "../../../hooks/useUrlWorkspaceId";
import { routes } from "../../../routers";
import { useRootStore } from "../../../store/root.store";

export default function CheckWorkspaceExist(props: {
	children: React.ReactNode;
}) {
	const rootStore = useRootStore();
	const workspaceId = useUrlWorkspaceId();
	const exist = rootStore.existsWorkspace(workspaceId);

	if (exist) {
		return <>{props.children}</>;
	}

	redirect(routes.home);
}
