import clsx from "clsx";
import { observer } from "mobx-react-lite";
import {} from "react";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router";
import { routes } from "../../router";
import { HoverWrapper } from "../../ui-kit/HoverWrapper";

export const Sidebar = observer(() => {
	const navigate = useNavigate();

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
					navigate(routes.settings);
				}}
			>
				<IoMdSettings size={22} />
			</HoverWrapper>
		</div>
	);
});
