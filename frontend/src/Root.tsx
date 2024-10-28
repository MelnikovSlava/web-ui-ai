import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { Outlet } from "react-router";
import { useHotkeysGlobal } from "./hooks/useHotkeys";
import { SnackBarManager } from "./ui-kit/snackbar/SnackBarManager";
import { useSetTheme } from "./utils/theme";

export const Root = observer(() => {
	useSetTheme();
	useHotkeysGlobal();

	return (
		<div
			className={clsx(
				"flex h-full w-full",
				"bg-[var(--main-background)] text-[var(--main-color-text)]",
				"border-t-[var(--main-border)] border-t",
			)}
		>
			<SnackBarManager />
			<Outlet />
		</div>
	);
});
