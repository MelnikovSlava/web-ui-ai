import clsx from "clsx";
import type { VitalProps } from "../../utils/types";

type PageBottomProps = {} & VitalProps;

export const PageBottom = (props: PageBottomProps) => {
	return (
		<div
			className={clsx(
				"flex border-t-[var(--main-border)] border-t",
				"py-4 px-6",
				"w-full",
				props.className,
			)}
		>
			{props.children}
		</div>
	);
};
