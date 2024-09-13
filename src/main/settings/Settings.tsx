import React, { FC, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { MainLayout } from "../../layouts/MainLayout";
import {
	FormControl,
	FormLabel,
	Input,
	Select,
	Tab,
	TabList,
	TabPanel,
	Tabs,
} from "@mui/joy";
import { localStorageUtils } from "../../utils/localStorage";
import { IButton } from "../../ui-kit/IButton";
import { useGlobalStore } from "../../store/global.store";
import { TabCommon } from "./TabCommon";
import { TabAppearance } from "./TabAppearance";

export const Settings = observer(() => {
	const store = useGlobalStore();

	const items = [
		{
			id: 0,
			title: "Common",
			content: <TabCommon />,
		},
		{
			id: 1,
			title: "Appearance",
			content: <TabAppearance />,
		},
		{
			id: 2,
			title: "Models",
			content: <TabCommon />,
		},
	];

	return (
		<MainLayout className={clsx("px-6 pt-7")}>
			<h1 className={clsx("text-[28px] font-bold", "mb-5")}>Settings</h1>

			<Tabs
				sx={{
					background: "transparent",
					color: "inherit",
				}}
				defaultValue={0}
				className={clsx("flex-1", "w-full")}
			>
				<TabList sx={{ color: 'inherit' }}>
					{items.map((item) => {
						return <Tab sx={{ background: 'transparent' }} key={item.id}>{item.title}</Tab>;
					})}
				</TabList>
				{items.map((item) => {
					return (
						<TabPanel value={item.id} key={item.id}>
							{item.content}
						</TabPanel>
					);
				})}
			</Tabs>

			<div
				className={clsx(
					"flex border-t-[var(--main-border)] border-t",
					"py-4 px-6 -mx-6",
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
