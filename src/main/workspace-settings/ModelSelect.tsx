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

type ModelSelectProps = {
	in: string;
	out: (value: string) => void;
} & VitalProps;

const aiStore = new AiStore();

export const ModelSelect: FC<ModelSelectProps> = observer((props) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [value, setValue] = useState<string | null>(null);

	useEffect(() => {
		if (!open || aiStore.models.length > 0) {
			return;
		}

		const loadModels = async () => {
			setLoading(true);
			await aiStore.fetchModels();
			setLoading(false);
		};

		loadModels();
	}, [open]);

	useEffect(() => {
		if (props.in) {
			setValue(props.in);
		}
	}, [props.in]);

	return (
		<FormControl id="model-select" className={clsx("", props.className)}>
			<FormLabel sx={{ color: "inherit" }}>Select AI Model</FormLabel>
			<Autocomplete
				sx={{ width: 300 }}
				open={open}
				onOpen={() => setOpen(true)}
				onClose={() => setOpen(false)}
				isOptionEqualToValue={(option, value) => option.id === value.id}
				options={aiStore.models}
				getOptionLabel={(option) => option.name}
				loading={loading}
				value={aiStore.models.find((model) => model.id === value) || null}
				onChange={(event, newValue) => {
					setValue(newValue ? newValue.name : null);
					props.out(newValue ? newValue.id : "");
				}}
				renderOption={(props, option) => (
					<li
						{...props}
						key={option.id}
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
				endDecorator={loading ? <CircularProgress size="sm" /> : null}
			/>
		</FormControl>
	);
});
