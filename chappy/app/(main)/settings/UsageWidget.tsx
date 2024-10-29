"use client";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../store/root.store";
import type { VitalProps } from "../../utils/types";

type UsageWidgetProps = {} & VitalProps;

export const UsageWidget = observer((props: UsageWidgetProps) => {
	const store = useRootStore();

	return (
		<div className={clsx("flex", props.className)}>
			<p>Usage: ${store.aiStore.creditsRemaining?.usage}</p>
		</div>
	);
});
