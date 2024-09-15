import React, { FC, useEffect, useState } from "react";
import {
	FormControl,
	FormLabel,
	Autocomplete,
	CircularProgress,
} from "@mui/joy";
import { VitalProps } from "../../utils/types";
import { AiStore } from "../../store/ai.store";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { useRootStore } from "../../store/root.store";
import { Model } from "../../store/types";

type ModelSelectProps = {} & VitalProps;

export const ModelSelect: FC<ModelSelectProps> = observer((props) => {
	const store = useRootStore();
	const workspace = store.currentWorkspaceStore;
	const models = store.aiStore.models;

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<Model | null>(() => {
		const modelId = workspace?.model;

		return models.find((model) => model.id === modelId) || null
	});

	return (
		<FormControl id="model-select" className={clsx("", props.className)}>
			<FormLabel sx={{ color: "inherit" }}>Select AI Model</FormLabel>
			<Autocomplete
				sx={{ width: 300 }}
				open={open}
				onOpen={() => setOpen(true)}
				onClose={() => setOpen(false)}
				isOptionEqualToValue={(option, value) => option.id === value.id}
				options={models}
				getOptionLabel={(option) => option.name}
				value={value}
				onChange={(event, newValue) => {
					setValue(newValue);
					workspace?.updateWorkspace({
						model: newValue ? newValue.id : ''
					})
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
		</FormControl>
	);
});
