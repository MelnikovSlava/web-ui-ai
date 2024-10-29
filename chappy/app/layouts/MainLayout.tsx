"use client";
import clsx from "clsx";
import type { VitalProps } from "../utils/types";

type MainLayoutProps = {} & VitalProps;

export const MainLayout = (props: MainLayoutProps) => {
	return (
		<div
			className={clsx(
				"flex flex-col w-full h-full items-start p-4",
				props.className,
			)}
		>
			{props.children}
		</div>
	);
};
