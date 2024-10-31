import LoadingButton from "@mui/lab/LoadingButton";
import { FormControl, FormLabel, TextField } from "@mui/material";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { useGetWorkspace } from "../../hooks/useGetWorkspace";
import { usePromise } from "../../hooks/usePromise";
import { INIT_WORKSPACE_TITLE } from "../../utils/constants";
import type { VitalProps } from "../../utils/types";

type TitleChangeProps = {} & VitalProps;

export const TitleChange = observer((props: TitleChangeProps) => {
	const workspaceStore = useGetWorkspace();
	const initTitle = workspaceStore.data.name || INIT_WORKSPACE_TITLE;

	const [title, setTitle] = useState(initTitle);

	const changed = useMemo(() => {
		return initTitle !== title;
	}, [initTitle, title]);

	const updateWorkspace = usePromise({
		func: () =>
			workspaceStore.root.updateWorkspaceAction(workspaceStore.data.id, {
				name: title,
			}),
		resolve: () => {
			// Handle success if needed
		},
	});

	return (
		<FormControl>
			<FormLabel sx={{ color: "inherit" }}>Title</FormLabel>
			<div className={clsx("flex")}>
				<TextField
					value={title}
					disabled={updateWorkspace.loading}
					onChange={(e) => {
						setTitle(e.target.value);
					}}
				/>
				{changed && (
					<LoadingButton
						variant="contained"
						loading={updateWorkspace.loading}
						onClick={() => {
							updateWorkspace.promise();
						}}
					>
						Save
					</LoadingButton>
				)}
			</div>
		</FormControl>
	);
});
