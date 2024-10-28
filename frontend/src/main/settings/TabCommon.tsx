import {} from "@mui/joy";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import {} from "react";
import type { VitalProps } from "../../utils/types";
import { InputToken } from "./InputToken";
import { UsageWidget } from "./UsageWidget";

type TabCommonProps = {} & VitalProps;

export const TabCommon = observer((props: TabCommonProps) => {
	return (
		<div className={clsx("flex flex-1 flex-col", props.className)}>
			<InputToken />

			<UsageWidget />
		</div>
	);
});
