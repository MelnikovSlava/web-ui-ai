import { observer } from "mobx-react-lite";
import {} from "react";
import { useRootStore } from "../store/root.store";
import { localStorageUtils } from "../utils/localStorage";
import type { VitalProps } from "../utils/types";

type KeyHandlerProps = {} & VitalProps;

export const KeyHandler = observer((props: KeyHandlerProps) => {
	const store = useRootStore();
	const key = store.settingsStore.key;

	if (!key) {
		const key = prompt("OpenRouter key:");

		if (key) {
			localStorageUtils.setKey(key);
		} else {
			return <h1>OpenRouter key is required. Update for input key again.</h1>;
		}
	}

	return props.children;
});
