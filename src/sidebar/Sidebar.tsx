import React, { FC, useContext } from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { RiApps2AddFill } from "react-icons/ri";
import { HoverWrapper } from "../ui-kit/HoverWrapper";
import { useGlobalStore } from "../store/global.store";
import { IoMdSettings } from "react-icons/io";

export const Sidebar = observer(() => {
	const store = useGlobalStore();

	return (
		<div
			className={clsx(
				"border-r-main-border border-r",
				"bg-sidebar-background",
				"w-[50px]",
				"flex flex-col items-center",
				"pb-4 pt-6",
			)}
		>
			<HoverWrapper className={clsx("")} onClick={store.createNewWorkspace}>
				<RiApps2AddFill size={22} className={clsx("")} />
			</HoverWrapper>

			<div className={clsx("flex-1")}></div>

			<HoverWrapper
				className={clsx("")}
				onClick={() => store.setView("settings")}
			>
				<IoMdSettings size={22} />
			</HoverWrapper>
		</div>
	);
});
