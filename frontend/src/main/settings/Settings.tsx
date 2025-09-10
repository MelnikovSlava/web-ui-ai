import { Button, Tab, Tabs } from "@mui/material";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { PageBottom } from "../../layouts/containers/PageBottom";
import { PageContainer } from "../../layouts/containers/PageContainer";
import { useRootStore } from "../../store/root.store";
import { TabAppearance } from "./TabAppearance";
import { TabCommon } from "./TabCommon";

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
	];

	return (
		<MainLayout className={clsx("items-start")}>
			<PageContainer>
				<h1 className={clsx("text-[28px] font-bold", "mb-5")}>Settings</h1>

				<Tabs
					value={tab}
					onChange={(event, newValue) => settab(newValue)}
				// className={clsx("w-full", "overflow-hidden")}
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
			</PageContainer>

			<PageBottom>
				<Button
					variant="contained"
					size="medium"
					onClick={store.settingsStore.applySettings}
				>
					Apply
				</Button>
			</PageBottom>
		</MainLayout>
	);
});
