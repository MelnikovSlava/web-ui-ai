import React, { FC, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { MainLayout } from "../../layouts/MainLayout";
import { FormControl, FormLabel, Input } from "@mui/joy";
import { localStorageUtils } from "../../utils/localStorage";
import { IButton } from "../../ui-kit/IButton";
import { useGlobalStore } from "../../store/global.store";

export const Settings = observer(() => {
	const store = useGlobalStore();

	const [token, setToken] = useState<string>(
		() => localStorageUtils.getToken() || "",
	);

	const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setToken(e.target.value);
	};

	const handleUpdateSettings = () => {
		localStorageUtils.setToken(token);
		store.aiStore.updateKey(token);
	};

	return (
		<MainLayout className={clsx("p-4")}>
			<h1 className={clsx("text-[28px] font-bold")}>Settings</h1>

			<div className={clsx("flex flex-1 flex-col")}>
				<FormControl>
					<FormLabel sx={{ color: "inherit" }}>Openrouter key</FormLabel>
					<Input value={token} onChange={handleTokenChange} />
				</FormControl>
			</div>

			<div className={clsx("flex")}>
				<IButton
					title="Apply"
					className={clsx("h-[38px]", "!bg-white !text-black", "")}
					size="md"
					onClick={handleUpdateSettings}
				/>
			</div>
		</MainLayout>
	);
});
