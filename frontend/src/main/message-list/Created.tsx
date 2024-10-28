import clsx from "clsx";
import type { VitalProps } from "../../utils/types";

type CreatedProps = {
	timestamp: number;
} & VitalProps;

export const Created = (props: CreatedProps) => {
	return (
		<span
			className={clsx(
				"w-full text-center text-[12px]",
				"inline-block",
				"my-5",
				props.className,
			)}
		>
			Created: {new Date(props.timestamp).toLocaleDateString()}
		</span>
	);
};
