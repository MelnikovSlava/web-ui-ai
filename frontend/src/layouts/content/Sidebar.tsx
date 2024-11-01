import { Stack } from "@mui/material";
import clsx from "clsx";
import { LogOut } from "lucide-react";
import { observer } from "mobx-react-lite";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router";
import { routes } from "../../router";
import { useRootStore } from "../../store/root.store";
import { HoverWrapper } from "../../ui-kit/HoverWrapper";

export const Sidebar = observer(() => {
	const navigate = useNavigate();
	const rootStore = useRootStore();

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

			<Stack spacing={1.5}>
				<HoverWrapper
					className={clsx("")}
					onClick={() => {
						navigate(routes.settings);
					}}
				>
					<IoMdSettings size={22} />
				</HoverWrapper>

				<HoverWrapper
					className={clsx("")}
					onClick={() => {
						const result = confirm("Are you sure you want to log out?");

						if (result) {
							rootStore.logout();
						}
					}}
				>
					<LogOut size={20} />
				</HoverWrapper>
			</Stack>
		</div>
	);
});
