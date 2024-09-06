import React from "react";
import clsx from "clsx";
import { VitalProps } from "../../../utils/types";

type StopBtnProps = {
	onClick: () => void;
} & VitalProps;

export const StopBtn: React.FC<StopBtnProps> = (props) => {
	return (
		<div
			className={clsx(
				"flex items-center justify-center",
				"h-[36px] w-[36px]",
				"rounded-lg",
				"bg-red-600",
				"cursor-pointer",
				"hover:opacity-100 opacity-90",
				props.className,
			)}
			onClick={props.onClick}
		>
			<div className={clsx("h-[14px] w-[14px]", "bg-gray-200", "rounded-sm")} />
		</div>
	);
};
