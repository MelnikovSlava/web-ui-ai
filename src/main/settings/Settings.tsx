import React, { FC, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { MainLayout } from "../../layouts/MainLayout";
import { localStorageUtils } from "../../utils/localStorage";
import { IButton } from "../../ui-kit/IButton";
import { useRootStore } from "../../store/root.store";
import { TabCommon } from "./TabCommon";
import { TabAppearance } from "./TabAppearance";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/ui-kit/ITabs"
import { TabModels } from "./TabModels";

type Tab = 'common' | 'appearance' | 'models';

type TabItem = {
	key: Tab;
	title: string;
	content: JSX.Element;
};

export const Settings = observer(() => {
	const store = useRootStore();
	const [tab, settab] = useState<Tab>('common');

	const items: TabItem[] = [
		{
			key: 'common',
			title: "Common",
			content: <TabCommon />,
		},
		{
			key: 'appearance',
			title: "Appearance",
			content: <TabAppearance />,
		},
		{
			key: 'models',
			title: "Models",
			content: <TabModels />,
		},
	];

	return (
		<MainLayout className={clsx("")}>
			<section className={clsx('px-6 pt-7', 'flex-1 flex flex-col', 'overflow-hidden')}>
				<h1 className={clsx("text-[28px] font-bold", "mb-5")}>Settings</h1>

				<Tabs
					defaultValue={tab}
					className={clsx("flex flex-col flex-1", "w-full", 'overflow-hidden')}
				>
					<TabsList>
						{items.map((item) => {
							return <TabsTrigger value={item.key} key={item.key}>{item.title}</TabsTrigger>;
						})}
					</TabsList>
					{items.map((item) => {
						return (
							<TabsContent className={clsx('overflow-auto')} value={item.key} key={item.key}>
								{item.content}
							</TabsContent>
						);
					})}
				</Tabs>
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
