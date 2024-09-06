import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import type { VitalProps } from "../../utils/types";
import { MainLayout } from "../../layouts/MainLayout";
import { FormControl, FormLabel, Input } from "@mui/joy";
import { useGlobalStore } from "../../store/global.store";
import { IButton } from "../../ui-kit/IButton";
import type { WorkspaceStore } from "../../store/workspace.store";
import { ModelSelect } from "./ModelSelect";

type WorkspaceSettingsProps = {} & VitalProps;

export const WorkspaceSettings = observer((props: WorkspaceSettingsProps) => {
	const store = useGlobalStore();
	const workspace = store.currentWorkspaceStore as WorkspaceStore;
	const [title, setTitle] = useState(workspace?.workspace.name || "");
	const [model, setModel] = useState<string>(workspace.model);

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const handleUpdateSettings = () => {
		workspace?.updateWorkspace(title, model);
	};

	const handleDeleteWorkspace = () => {
		if (window.confirm("Are you sure you want to delete this workspace?")) {
			store.deleteWorkspace(workspace.workspace.id);
		}
	};

	return (
		<MainLayout className={clsx("p-4", props.className)}>
			<h1 className={clsx("text-[28px] font-bold")}>Workspace Settings</h1>

			<div className={clsx("flex flex-1 flex-col")}>
				<FormControl>
					<FormLabel sx={{ color: "inherit" }}>Title</FormLabel>
					<Input value={title} onChange={handleTitleChange} />
				</FormControl>

				<ModelSelect in={model} out={setModel} className={clsx("mt-4")} />
			</div>

			<div className={clsx("flex")}>
				<IButton
					title="Update Settings"
					className={clsx("h-[38px]", "!bg-white !text-black", "")}
					size="md"
					onClick={handleUpdateSettings}
				/>

				<IButton
					title="Delete workspace"
					variant="outlined"
					color="danger"
					className={clsx("h-[38px]", "!ml-2", "")}
					size="md"
					onClick={handleDeleteWorkspace}
				/>
			</div>
		</MainLayout>
	);
});
