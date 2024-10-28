import clsx from "clsx";
import type { VitalProps } from "../utils/types";

type ILoaderDotsProps = {} & VitalProps;

export const LoaderDots = (props: ILoaderDotsProps) => {
	return <p className={clsx("loader-dots", props.className)} />;
};
