import clsx from "clsx";
import type { HTMLAttributes } from "react";
import type { VitalProps } from "../utils/types";

export type HoverWrapperProps = {
	disabled?: boolean;
} & VitalProps &
	HTMLAttributes<HTMLSpanElement>;

export const HoverWrapper = (props: HoverWrapperProps) => {
	const { children, className, ...rest } = props;

	return (
		<span
			{...rest}
			className={clsx(
				props.disabled
					? "cursor-not-allowed"
					: "cursor-pointer hover:opacity-100",
				"opacity-30",
				"select-none",
				"text-[var(--control-element)]",
				className,
			)}
		>
			{children}
		</span>
	);
};
