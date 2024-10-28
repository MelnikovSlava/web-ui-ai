import clsx from "clsx";
import { HoverWrapper, type HoverWrapperProps } from "./HoverWrapper";

type IconWrapperProps = HoverWrapperProps;

const SIZE = 24;

export const IconWrapper = (props: IconWrapperProps) => {
	const { children, className, ...rest } = props;

	return (
		<HoverWrapper
			{...rest}
			style={{
				height: SIZE,
				width: SIZE,
			}}
			className={clsx(
				"rounded-md",
				"flex justify-center items-center",
				"hover:border-[var(--control-element)] hover:border",
				"active:border-[var(--main-border)]",
				"active:opacity-40",
				className,
			)}
		>
			{children}
		</HoverWrapper>
	);
};
