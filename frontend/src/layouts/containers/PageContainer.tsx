import clsx from "clsx";
import type { VitalProps } from "../../utils/types";

type PageContainerProps = {} & VitalProps;

export const PageContainer = (props: PageContainerProps) => {
	return (
		<div
			className={clsx(
				"px-6 pt-7",
				"flex-1 flex flex-col",
				"overflow-hidden",
				props.className,
			)}
		>
			{props.children}
		</div>
	);
};
