import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { useRootStore } from "../../store/root.store";
import type { VitalProps } from "../../utils/types";
import { FormControl, TextField } from "@mui/material";
import numerify from 'numerify';
import { Star } from "lucide-react";
import { usePromise } from "../../hooks/usePromise";

type TabModelsProps = {} & VitalProps;

export const TabModels = observer((props: TabModelsProps) => {
	const store = useRootStore();

	const [value, setValue] = useState<string>("");

	const onAdd = usePromise({
		func: store.addModelAction,
	});

	const onRemove = usePromise({
		func: store.deleteModelAction,
	});

	const models = store.aiStore.models.filter((model) =>
		model.name.toLowerCase().includes(value.toLowerCase()),
	);

	const round = (num: number) => {
		return parseFloat(num.toFixed(2));
	}

	const getText = (text: string, value: string | number) => {
		return `${text}: ${value}$`
	}

	const sorted = useMemo(() => {
		return models.sort((a, b) => {
			return store.inCollection(a.id) ? -1 : store.inCollection(b.id) ? 1 : 0;
		});
	}, [models, store.models.length]);

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
							<Star className="w-4 h-4" />
						</th>
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
					{sorted.map((model) => {
						const pricePrompt = round(parseFloat(model.pricing.prompt) * 1000000);
						const priceCompletion = round(parseFloat(model.pricing.completion) * 1000000);
						const context = numerify(model.context_length, '0 a');
						const inCollection = store.inCollection(model.id);

						return <tr
							key={model.id}
							className={clsx(
								"border-b border-[var(--main-border)] hover:bg-gray-800",
							)}
						>
							<td className={clsx("px-6 py-4", "cursor-pointer")} onClick={() => {
								if (inCollection) {
									onRemove.promise(model.id)
								} else {
									onAdd.promise(model.id)
								}
								}}>
									<Star className={clsx('w-4 h-4 opacity-50', inCollection && "text-yellow-400")} fill={inCollection ? "yellow": undefined} />
							</td>
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
