import { useParams } from "react-router";

export const useUrlWorkspaceId = () => {
	const params = useParams();
	const urlWorkspaceId = Number(params?.workspaceId);

	return urlWorkspaceId;
};
