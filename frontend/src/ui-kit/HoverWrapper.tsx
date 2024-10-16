import React, { FC } from "react";
import clsx from "clsx";
import { VitalProps } from "../utils/types";
import { HTMLAttributes } from "react";

export type HoverWrapperProps = {} & VitalProps & HTMLAttributes<HTMLSpanElement>;

export const HoverWrapper = (props: HoverWrapperProps) => {
	const { children, className, ...rest } = props;

	return (
		<span
			{...rest}
			className={clsx(
				"cursor-pointer",
				"select-none",
				"hover:opacity-100 opacity-30",
				"text-[var(--control-element)]",
				className,
			)}
		>
			{children}
		</span>
	);
};
