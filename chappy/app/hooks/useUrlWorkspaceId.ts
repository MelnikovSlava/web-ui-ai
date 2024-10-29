import { useParams } from "next/navigation";

export const useUrlWorkspaceId = () => {
	const params = useParams<{ workspaceId: string }>();
	const urlWorkspaceId = Number(params.workspaceId);

	return urlWorkspaceId;
};
