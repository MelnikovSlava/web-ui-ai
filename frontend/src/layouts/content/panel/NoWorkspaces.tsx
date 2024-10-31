import clsx from "clsx";
import { GoArrowLeft } from "react-icons/go";
import type { VitalProps } from "../../../utils/types";

type NoWorkspacesProps = {} & VitalProps;

export const NoWorkspaces = (props: NoWorkspacesProps) => {
	return (
		<div
			className={clsx(
				"flex items-center",
				"w-full justify-center",
				"opacity-30",
				props.className,
			)}
		>
			<GoArrowLeft />
			<span className={clsx("ml-2")}>Create new workspace</span>
		</div>
	);
};
