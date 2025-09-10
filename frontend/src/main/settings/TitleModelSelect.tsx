import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, FormControl, FormLabel, TextField } from "@mui/material";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { type FC, useMemo, useState } from "react";
import { usePromise } from "../../hooks/usePromise";
import { useRootStore } from "../../store/root.store";
import { DEFAULT_TITLE_MODEL } from "../../utils/constants";
import type { Model } from "../../store/types";
import type { VitalProps } from "../../utils/types";

type TitleModelSelectProps = {} & VitalProps;

export const TitleModelSelect: FC<TitleModelSelectProps> = observer((props) => {
	const rootStore = useRootStore();
	const models = rootStore.openrouterStore.models;
	const settingsStore = rootStore.settingsStore;

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState<Model>(() => {
		return settingsStore.getTitleModelForSelect() as Model;
	});

	const changed = useMemo(() => {
		return settingsStore.isTitleModelChanged(value.id);
	}, [settingsStore.titleModel, value.id]);

	const onUpdate = usePromise({
		func: () => settingsStore.updateTitleModelAction(value.id),
		resolve: () => {
			// Handle success if needed
		},
	});

	return (
		<FormControl id="title-model-select" className={clsx("flex", props.className)}>
			<FormLabel sx={{ color: "inherit" }}>Select Title Generation Model</FormLabel>
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
					</li>
				)}
			/>

			{changed && (
				<LoadingButton
					loading={onUpdate.loading}
					onClick={() => {
						onUpdate.promise();
					}}
					className={clsx("mt-2")}
				>
					Save
				</LoadingButton>
			)}
		</FormControl>
	);
});
