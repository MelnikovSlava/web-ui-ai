import React, { FC } from "react";
import clsx from "clsx";
import { VitalProps } from "../utils/types";
import { GoArrowLeft } from "react-icons/go";

type NoWorkspacesProps = {} & VitalProps;

export const NoWorkspaces = (props: NoWorkspacesProps) => {
	return (
		<div
			className={clsx(
				"flex items-center",
				"w-full justify-center",
				"opacity-30",
				props.className,
			)}
		>
			<GoArrowLeft />
			<span className={clsx("ml-2")}>Create new workspace</span>
		</div>
	);
};
