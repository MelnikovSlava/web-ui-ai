import { Autocomplete, FormControl, FormLabel } from "@mui/joy";
import LoadingButton from "@mui/lab/LoadingButton";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { type FC, useMemo, useState } from "react";
import { usePromise } from "../../hooks/usePromise";
import { useUrlWorkspaceId } from "../../hooks/useUrlWorkspaceId";
import { useRootStore } from "../../store/root.store";
import type { Model } from "../../store/types";
import { DEFAULT_MODEL } from "../../utils/constants";
import type { VitalProps } from "../../utils/types";

type ModelSelectProps = {} & VitalProps;

export const ModelSelect: FC<ModelSelectProps> = observer((props) => {
	const rootStore = useRootStore();
	const urlWorkspaceId = useUrlWorkspaceId();
	const workspace = rootStore.getWorkspace(urlWorkspaceId);
	const models = rootStore.aiStore.models;
	const currentModel = workspace.data.model || DEFAULT_MODEL;

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<Model>(() => {
		const model = models.find((m) => m.id === currentModel);

		if (!model) {
			throw new Error("Model not found");
		}

		return model;
	});

	const chanched = useMemo(() => {
		return currentModel !== value.id;
	}, [currentModel, value]);

	const updateWorkspace = usePromise({
		func: () =>
			rootStore.updateWorkspaceAction(urlWorkspaceId, {
				model: value ? value.id : "",
			}),
		resolve: () => {
			// Handle success if needed
		},
	});

	return (
		<FormControl id="model-select" className={clsx("flex", props.className)}>
			<FormLabel sx={{ color: "inherit" }}>Select AI Model</FormLabel>
			<Autocomplete
				sx={{ width: 300 }}
				open={open}
				onOpen={() => setOpen(true)}
				onClose={() => setOpen(false)}
				isOptionEqualToValue={(option, value) => option.id === value.id}
				options={models}
				disabled={updateWorkspace.loading}
				getOptionLabel={(option) => option.name}
				value={value}
				onChange={(event, newValue) => {
					if (newValue) {
						setValue(newValue);
					}
				}}
				renderOption={(props, option) => (
					<li
						{...props}
						// key={option.id}
						className={clsx(
							"p-1",
							"pb-2",
							"hover:bg-gray-100",
							"cursor-pointer",
							"flex flex-col",
						)}
					>
						<span className={clsx("text-[14px]")}>{option.name}</span>
						<span className={clsx("text-[12px] text-gray-400")}>
							{option.id}
						</span>
						{/* <span className={clsx("text-[10px] text-gray-400")}>
							In: {option.pricing.prompt} Out: {option.pricing.completion}
						</span> */}
					</li>
				)}
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
