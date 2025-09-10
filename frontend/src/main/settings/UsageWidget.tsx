import clsx from "clsx";
import { observer } from "mobx-react-lite";
import {} from "react";
import { useRootStore } from "../../store/root.store";
import type { VitalProps } from "../../utils/types";

type UsageWidgetProps = {} & VitalProps;

export const UsageWidget = observer((props: UsageWidgetProps) => {
	const store = useRootStore();

	return (
		<div className={clsx("flex", props.className)}>
			<p>Usage: ${store.openrouterStore.creditsRemaining?.usage}</p>
		</div>
	);
});
