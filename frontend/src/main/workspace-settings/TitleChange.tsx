import { FormControl, FormLabel, Input } from "@mui/joy";
import LoadingButton from "@mui/lab/LoadingButton";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { usePromise } from "../../hooks/usePromise";
import { useUrlWorkspaceId } from "../../hooks/useUrlWorkspaceId";
import { useRootStore } from "../../store/root.store";
import { INIT_WORKSPACE_TITLE } from "../../utils/constants";
import type { VitalProps } from "../../utils/types";
import clsx from "clsx";

type TitleChangeProps = {} & VitalProps;

export const TitleChange = observer((props: TitleChangeProps) => {
	const rootStore = useRootStore();
	const urlWorkspaceId = useUrlWorkspaceId();
	const workspaceStore = rootStore.getWorkspace(urlWorkspaceId);

	const [title, setTitle] = useState(
		workspaceStore.data.name || INIT_WORKSPACE_TITLE,
	);

	const chanched = useMemo(() => {
		return workspaceStore.data.name !== title;
	}, [workspaceStore.data.name, title]);

	const updateWorkspace = usePromise({
		func: () =>
			rootStore.updateWorkspaceAction(urlWorkspaceId, {
				name: title,
			}),
		resolve: () => {
			// Handle success if needed
		},
	});

	return (
		<FormControl className={clsx("flex")}>
			<FormLabel sx={{ color: "inherit" }}>Title</FormLabel>
			<Input
				value={title}
				disabled={updateWorkspace.loading}
				onChange={(e) => {
					setTitle(e.target.value);
				}}
			/>
			{chanched && (
				<LoadingButton
					loading={updateWorkspace.loading}
					onClick={() => {
						updateWorkspace.promise();
					}}
				>
					Save
				</LoadingButton>
			)}
		</FormControl>
	);
});
