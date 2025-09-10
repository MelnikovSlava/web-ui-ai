import clsx from "clsx";
import { observer } from "mobx-react-lite";

export const Sidebar = observer(() => {
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
		</div>
	);
});
