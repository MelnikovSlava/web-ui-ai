import LoadingButton from "@mui/lab/LoadingButton";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import {} from "react";
import { useNavigate } from "react-router";
import { usePromise } from "../../hooks/usePromise";
import { useUrlWorkspaceId } from "../../hooks/useUrlWorkspaceId";
import { MainLayout } from "../../layouts/MainLayout";
import { PageBottom } from "../../layouts/containers/PageBottom";
import { PageContainer } from "../../layouts/containers/PageContainer";
import { routes } from "../../router";
import { useRootStore } from "../../store/root.store";
import { ModelSelect } from "./ModelSelect";
import { TitleChange } from "./TitleChange";

export const WorkspaceSettings = observer(() => {
	const rootStore = useRootStore();
	const urlWorkspaceId = useUrlWorkspaceId();
	const navigate = useNavigate();

	const deleteWorkspace = usePromise({
		func: async () => {
			const msg = "Are you sure you want to delete this workspace?";

			if (window.confirm(msg)) {
				let route = routes.home;

				const otherWorkspaces = rootStore.workspaces.filter(
					(w) => w.data.id !== urlWorkspaceId,
				);

				if (otherWorkspaces.length > 0) {
					const lastWorkspace = otherWorkspaces[otherWorkspaces.length - 1];
					route = routes.workspace(lastWorkspace.data.id);
				}

				rootStore.deleteWorkspaceAction(urlWorkspaceId);

				navigate(route, { replace: true });
			}
		},
	});

	return (
		<MainLayout>
			<PageContainer>
				<h1 className={clsx("text-[28px] font-bold")}>Workspace Settings</h1>

				<div className={clsx("flex flex-1 flex-col")}>
					<TitleChange />

					<ModelSelect className={clsx("mt-4")} />
				</div>
			</PageContainer>

			<PageBottom>
				<LoadingButton
					variant="contained"
					className={clsx("!ml-2")}
					size="medium"
					onClick={deleteWorkspace.promise}
					loading={deleteWorkspace.loading}
				>
					Delete workspace
				</LoadingButton>
			</PageBottom>
		</MainLayout>
	);
});
