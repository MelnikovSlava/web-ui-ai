import React, { FC, useContext } from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { VitalProps } from "../../utils/types";
import { useGlobalStore } from "../../store/global.store";

type UsageWidgetProps = {} & VitalProps;

export const UsageWidget = observer((props: UsageWidgetProps) => {
	const store = useGlobalStore();

	return (
		<div className={clsx("flex", props.className)}>
			<p>Usage: ${store.aiStore.creditsRemaining?.usage}</p>
		</div>
	);
});