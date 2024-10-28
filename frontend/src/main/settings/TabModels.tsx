import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useRootStore } from "../../store/root.store";
import { IInput } from "../../ui-kit/IInput";
import type { VitalProps } from "../../utils/types";

type TabModelsProps = {} & VitalProps;

export const TabModels = observer((props: TabModelsProps) => {
	const store = useRootStore();

	const [value, setValue] = useState<string>("");

	const models = store.aiStore.models.filter((model) =>
		model.name.toLowerCase().includes(value.toLowerCase()),
	);

	return (
		<div className={clsx("w-full", props.className)}>
			<IInput
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				className={clsx("mb-4")}
			/>

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
					{models.map((model) => (
						<tr
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
									<span>Prompt:{model.pricing.prompt}</span>
									<span>Completion:{model.pricing.completion}</span>
								</span>
							</td>
							<td className={clsx("px-6 py-4")}>{model.context_length}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
});
