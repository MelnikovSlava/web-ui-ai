import { useState } from "react";
import { useShowErrorNotification } from "../ui-kit/snackbar/snackbar-manager";
import type { RStatus } from "../utils/types";

export const usePromise = <_, K>(params: {
	func: (...args: any) => Promise<K>;
	showError?: boolean;
	errorMsg?: string;
	resolve?: (value?: K) => void;
	reject?: (
		error: unknown,
		showError?: ReturnType<typeof useShowErrorNotification>,
	) => void;
	finally?: () => void;
}) => {
	const { func, showError = true, errorMsg, resolve, reject } = params;
	const showErrorNotif = useShowErrorNotification();

	const [state, setState] = useState<RStatus | null>(null);
	const [data, setData] = useState<K | null>(null);
	const [error, setError] = useState<unknown | null>(null);

	const promise = async (...args: Parameters<typeof func>) => {
		const prom = func(...args);

		try {
			setState("pending");

			const result = await prom;

			if (resolve) {
				resolve(result as any);
			}

			setData(result);
			setState("done");
		} catch (e: any) {
			if (reject) {
				reject(e, showErrorNotif);
			}

			if (showError) {
				showErrorNotif(e?.message);
			}

			setState("error");
			setError(e);
		} finally {
			if (params.finally) {
				params.finally();
			}
		}

		return prom;
	};

	return {
		state,
		promise,
		data,
		error,
		loading: state === "pending",
	};
};
