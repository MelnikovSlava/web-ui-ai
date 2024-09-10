import React, { FC } from "react";
import clsx from "clsx";
import { VitalProps } from "../utils/types";
import { HoverWrapper } from "./HoverWrapper";

type IconWrapperProps = {} & VitalProps;

export const IconWrapper = (props: IconWrapperProps) => {
	const { children, className, ...rest } = props;

	return (
		<HoverWrapper
			{...rest}
			className={clsx(
				"border-main-border border",
				"rounded-lg",
				"h-[32px] w-[32px]",
				"flex justify-center items-center",
				className,
			)}
		>
			{children}
		</HoverWrapper>
	);
};
