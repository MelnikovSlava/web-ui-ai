import clsx from "clsx";
import type { VitalProps } from "../../utils/types";

type EmptyProps = {} & VitalProps;

export const Empty = (props: EmptyProps) => {
	return (
		<div
			className={clsx(
				"w-full h-full flex items-center justify-center flex-col",
			)}
		>
			<span className={clsx("text-[26px]")}>👍</span>
			<span>You have no messages!</span>
		</div>
	);
};
