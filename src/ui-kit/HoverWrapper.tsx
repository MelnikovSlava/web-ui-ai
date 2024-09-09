import React, { FC } from "react";
import clsx from "clsx";
import { VitalProps } from "../utils/types";
import { HTMLAttributes } from "react";

type HoverWrapperProps = {} & VitalProps & HTMLAttributes<HTMLSpanElement>;

export const HoverWrapper = (props: HoverWrapperProps) => {
	const { children, className, ...rest } = props;

	return (
		<span
			{...rest}
			className={clsx(
				"cursor-pointer",
				"select-none",
				"hover:opacity-100 opacity-40",
				"text-control-element",
				className,
			)}
		>
			{children}
		</span>
	);
};
