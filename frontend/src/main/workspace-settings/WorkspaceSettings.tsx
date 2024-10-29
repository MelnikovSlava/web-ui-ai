import {} from "@mui/joy";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import {} from "react";
import { useNavigate } from "react-router";
import { usePromise } from "../../hooks/usePromise";
import { useUrlWorkspaceId } from "../../hooks/useUrlWorkspaceId";
import { MainLayout } from "../../layouts/MainLayout";
import { routes } from "../../router";
import { useRootStore } from "../../store/root.store";
import { IButton } from "../../ui-kit/IButton";
import { ModelSelect } from "./ModelSelect";
import { TitleChange } from "./TitleChange";

export const WorkspaceSettings = observer(() => {
	const rootStore = useRootStore();
	const navigate = useNavigate();
	const urlWorkspaceId = useUrlWorkspaceId();

	const deleteWorkspace = usePromise({
		func: async () => {
			const msg = "Are you sure you want to delete this workspace?";

			if (window.confirm(msg)) {
				let route = routes.root;

				const otherWorkspaces = rootStore.allWorkspaces.filter(
					(w) => w.data.id !== urlWorkspaceId,
				);

				if (otherWorkspaces.length > 0) {
					const lastWorkspace = otherWorkspaces[otherWorkspaces.length - 1];
					route = routes.workspace(lastWorkspace.data.id);
				}

				navigate(route);

				await rootStore.deleteWorkspaceAction(urlWorkspaceId);
			}
		},
	});

	return (
		<MainLayout className={clsx("p-4")}>
			<h1 className={clsx("text-[28px] font-bold")}>Workspace Settings</h1>

			<div className={clsx("flex flex-1 flex-col")}>
				<TitleChange />

				<ModelSelect className={clsx("mt-4")} />
			</div>

			<div className={clsx("flex")}>
				<IButton
					title="Delete workspace"
					variant="outlined"
					color="danger"
					className={clsx("h-[38px]", "!ml-2", "")}
					size="md"
					onClick={deleteWorkspace.promise}
					loading={deleteWorkspace.loading}
				/>
			</div>
		</MainLayout>
	);
});
