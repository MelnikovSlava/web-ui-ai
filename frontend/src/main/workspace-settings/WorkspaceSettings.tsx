import { FormControl, FormLabel, Input } from "@mui/joy";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useUrlWorkspaceId } from "../../hooks/useUrlWorkspaceId";
import { MainLayout } from "../../layouts/MainLayout";
import { routes } from "../../router";
import { useRootStore } from "../../store/root.store";
import { IButton } from "../../ui-kit/IButton";
import { INIT_WORKSPACE_TITLE } from "../../utils/constants";
import { ModelSelect } from "./ModelSelect";

export const WorkspaceSettings = observer(() => {
	const store = useRootStore();
	const navigate = useNavigate();
	const urlWorkspaceId = useUrlWorkspaceId();
	const workspace = useMemo(() => {
		return store.getWorkspace(urlWorkspaceId);
	}, [urlWorkspaceId, store]);

	const [title, setTitle] = useState(workspace.name || INIT_WORKSPACE_TITLE);

	return (
		<MainLayout className={clsx("p-4")}>
			<h1 className={clsx("text-[28px] font-bold")}>Workspace Settings</h1>

			<div className={clsx("flex flex-1 flex-col")}>
				<FormControl>
					<FormLabel sx={{ color: "inherit" }}>Title</FormLabel>
					<Input
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
						}}
					/>
				</FormControl>

				<ModelSelect className={clsx("mt-4")} />
			</div>

			<div className={clsx("flex")}>
				<IButton
					title="Update Settings"
					className={clsx("h-[38px]", "!bg-white !text-black", "")}
					size="md"
					onClick={() => {
						workspace.updateWorkspace({
							name: title,
						});
					}}
				/>

				<IButton
					title="Delete workspace"
					variant="outlined"
					color="danger"
					className={clsx("h-[38px]", "!ml-2", "")}
					size="md"
					onClick={() => {
						const msg = "Are you sure you want to delete this workspace?";

						if (window.confirm(msg)) {
							let route = routes.root;

							const otherWorkspaces = store.allWorkspaces.filter(
								(w) => w.id !== workspace.id,
							);

							if (otherWorkspaces.length > 0) {
								const lastWorkspace =
									otherWorkspaces[otherWorkspaces.length - 1];

								route = routes.workspace(lastWorkspace.id);
							}

							navigate(route);

							store.deleteWorkspace(workspace.id);
						}
					}}
				/>
			</div>
		</MainLayout>
	);
});
