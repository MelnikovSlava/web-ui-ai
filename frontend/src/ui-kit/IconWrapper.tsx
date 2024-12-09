import clsx from "clsx";
import { HoverWrapper, type HoverWrapperProps } from "./HoverWrapper";

type IconWrapperProps = { size?: number } & HoverWrapperProps;

export const IconWrapper = (props: IconWrapperProps) => {
	const { children, className, ...rest } = props;
	const SIZE = props.size ?? 24;

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
