import clsx from "clsx";
import { Outlet } from "react-router";
import { useHotkeysGlobal } from "../hooks/hotkeys/useGlobalHotkeys";
import { SnackBarManager } from "../ui-kit/snackbar/SnackBarManager";
import { useSetTheme } from "../utils/theme";
import { useMobile } from "../hooks/useMobile";

export const Root = () => {
	useSetTheme();
	useHotkeysGlobal();

	const isMobile = useMobile();

	return (
		<div
			className={clsx(
				"flex",
				isMobile && 'flex-col',
				"h-full w-full",
				"bg-[var(--main-background)] text-[var(--main-color-text)]",
				!isMobile && "border-t-[var(--main-border)] border-t",
			)}
		>
			<SnackBarManager />
			<Outlet />
		</div>
	);
};
