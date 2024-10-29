"use client";
import { Tab, Tabs } from "@mui/material";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { IButton } from "../../components/ui-kit/IButton";
import { MainLayout } from "../../layouts/MainLayout";
import { useRootStore } from "../../store/root.store";
import { TabAppearance } from "./TabAppearance";
import { TabCommon } from "./TabCommon";
import { TabModels } from "./TabModels";

export const Settings = observer(() => {
	const store = useRootStore();
	const [tab, settab] = useState<string>("common");

	const items: { key: string; title: string; content: JSX.Element }[] = [
		{
			key: "common",
			title: "Common",
			content: <TabCommon />,
		},
		{
			key: "appearance",
			title: "Appearance",
			content: <TabAppearance />,
		},
		{
			key: "models",
			title: "Models",
			content: <TabModels />,
		},
	];

	return (
		<MainLayout className={clsx("")}>
			<section
				className={clsx("px-6 pt-7", "flex-1 flex flex-col", "overflow-hidden")}
			>
				<h1 className={clsx("text-[28px] font-bold", "mb-5")}>Settings</h1>

				<Tabs
					value={tab}
					onChange={(event, newValue) => settab(newValue)}
					className={clsx("w-full", "overflow-hidden")}
				>
					{items.map((item) => (
						<Tab label={item.title} value={item.key} key={item.key} />
					))}
				</Tabs>
				{items.map((item) => (
					<div
						className={clsx("overflow-auto")}
						hidden={tab !== item.key}
						key={item.key}
					>
						{item.content}
					</div>
				))}
			</section>

			<div
				className={clsx(
					"flex border-t-[var(--main-border)] border-t",
					"py-4 px-6",
					"w-full",
				)}
			>
				<IButton
					title="Apply"
					className={clsx("h-[38px]", "!bg-white !text-black", "")}
					size="md"
					onClick={store.settingsStore.applySettings}
				/>
			</div>
		</MainLayout>
	);
});
