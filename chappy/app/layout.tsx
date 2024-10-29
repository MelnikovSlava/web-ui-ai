"use client";

import clsx from "clsx";
import { useHotkeysGlobal } from "./hooks/useHotkeys";
import "./index.css";
import { SnackBarManager } from "./components/ui-kit/snackbar/SnackBarManager";
import { useSetTheme } from "./utils/theme";
import type { VitalProps } from "./utils/types";

export default function RootLayout(props: VitalProps) {
	useSetTheme();
	useHotkeysGlobal();

	return (
		<html lang="en">
			<link rel="icon" href="/icon.png" />
			<body>
				<div
					className={clsx(
						"flex h-full w-full",
						"bg-[var(--main-background)] text-[var(--main-color-text)]",
						"border-t-[var(--main-border)] border-t",
					)}
				>
					<SnackBarManager />
					{props.children}
				</div>
			</body>
		</html>
	);
}
