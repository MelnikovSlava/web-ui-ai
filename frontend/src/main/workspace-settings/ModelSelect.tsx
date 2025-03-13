import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, FormControl, FormLabel, TextField } from "@mui/material";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { type FC, useMemo, useState } from "react";
import { useGetWorkspace } from "../../hooks/useGetWorkspace";
import { usePromise } from "../../hooks/usePromise";
import { rootStore } from "../../store/root.store";
import type { Model } from "../../store/types";
import { DEFAULT_MODEL } from "../../utils/constants";
import type { VitalProps } from "../../utils/types";

type ModelSelectProps = {} & VitalProps;

export const ModelSelect: FC<ModelSelectProps> = observer((props) => {
	const workspace = useGetWorkspace();
	const models = workspace.root.aiStore.models;
	const currentModel = workspace.getModel();

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

	const onUpdate = usePromise({
		func: () =>
			rootStore.updateWorkspaceModelAction(
				workspace.data.id,
				value ? value.id : "",
			),
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
				disabled={onUpdate.loading}
				getOptionLabel={(option) => option.name}
				value={value}
				renderInput={(params) => <TextField {...params} />}
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
					loading={onUpdate.loading}
					onClick={() => {
						onUpdate.promise();
					}}
				>
					Save
				</LoadingButton>
			)}
		</FormControl>
	);
});
