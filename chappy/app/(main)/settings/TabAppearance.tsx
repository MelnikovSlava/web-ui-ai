"use client";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import type { VitalProps } from "../../utils/types";
import { SelectTheme } from "./SelectTheme";

type TabAppearanceProps = {} & VitalProps;

export const TabAppearance = observer((props: TabAppearanceProps) => {
	return (
		<div className={clsx("", props.className)}>
			<SelectTheme />
		</div>
	);
});
