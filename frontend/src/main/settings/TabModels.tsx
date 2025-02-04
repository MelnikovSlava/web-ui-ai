import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useRootStore } from "../../store/root.store";
import type { VitalProps } from "../../utils/types";
import { FormControl, TextField } from "@mui/material";
import numerify from 'numerify';

type TabModelsProps = {} & VitalProps;

export const TabModels = observer((props: TabModelsProps) => {
	const store = useRootStore();

	const [value, setValue] = useState<string>("");

	const models = store.aiStore.models.filter((model) =>
		model.name.toLowerCase().includes(value.toLowerCase()),
	);

	const round = (num: number) => {
		return parseFloat(num.toFixed(2));
	}

	const getText = (text: string, value: string | number) => {
		return `${text}: ${value}$`
	}

	return (
		<div className={clsx("w-full", props.className)}>
			<FormControl>
				{/* <FormLabel sx={{ color: "inherit" }}>{props.label}</FormLabel> */}
				<TextField
					value={value}
					onChange={(e) => {
						setValue(e.target.value);
					}}
					className={clsx("mb-4")}
				/>
			</FormControl>

			<table
				className={clsx(
					"w-full text-sm text-left rtl:text-right border border-[var(--main-border)]",
					"rounded-lg",
				)}
			>
				<thead
					className={clsx(
						"text-xs uppercase border-b border-[var(--main-border)]",
					)}
				>
					<tr>
						<th scope="col" className={clsx("px-6 py-3")}>
							Name
						</th>
						<th scope="col" className={clsx("px-6 py-3")}>
							Price
						</th>
						<th scope="col" className={clsx("px-6 py-3")}>
							Context
						</th>
					</tr>
				</thead>
				<tbody>
					{models.map((model) => {
						const pricePrompt = round(parseFloat(model.pricing.prompt) * 1000000);
						const priceCompletion = round(parseFloat(model.pricing.completion) * 1000000);
						const context = numerify(model.context_length, '0 a');

						return <tr
							key={model.id}
							className={clsx(
								"border-b border-[var(--main-border)] hover:bg-gray-800",
							)}
						>
							<th
								scope="row"
								className={clsx("px-6 py-4 font-medium whitespace-nowrap")}
							>
								<span className={clsx("flex flex-col")}>
									<span>{model.name}</span>
									<span className={clsx("text-xs opacity-50")}>{model.id}</span>
								</span>
							</th>
							<td className={clsx("px-6 py-4")}>
								<span className={clsx("flex flex-col", "text-xs opacity-50")}>
									<span>{getText('Prompt', pricePrompt)}</span>
									<span>{getText('Completion', priceCompletion)}</span>
								</span>
							</td>
							<td className={clsx("px-6 py-4")}>{context}</td>
						</tr>
					})}
				</tbody>
			</table>
		</div>
	);
});
