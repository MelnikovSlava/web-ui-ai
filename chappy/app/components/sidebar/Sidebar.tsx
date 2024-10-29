"use client";

import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import {} from "react";
import { IoMdSettings } from "react-icons/io";
import { routes } from "../../routers";
import { HoverWrapper } from "../ui-kit/HoverWrapper";

export const Sidebar = observer(() => {
	const router = useRouter();

	return (
		<div
			className={clsx(
				"border-r-[var(--main-border)] border-r",
				"bg-[var(--sidebar-background)]",
				"w-[50px]",
				"flex flex-col items-center",
				"pb-4 pt-6",
			)}
		>
			{/* <HoverWrapper className={clsx("")} onClick={store.createNewWorkspace}>
				<RiApps2AddFill size={22} className={clsx("")} />
			</HoverWrapper> */}

			<div className={clsx("flex-1")} />

			<HoverWrapper
				className={clsx("")}
				onClick={() => {
					router.push(routes.settings);
				}}
			>
				<IoMdSettings size={22} />
			</HoverWrapper>
		</div>
	);
});
