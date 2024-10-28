import { CircularProgress } from "@mui/joy";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { KeyHandler } from "./layouts/KeyHandler";
import { useRootStore } from "./store/root.store";
import { delayPromise } from "./utils/utils";

export const App = () => {
	const store = useRootStore();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		delayPromise(
			Promise.all([store.getDataAction(), store.aiStore.fetchModels()]),
		).then(() => {
			setIsLoading(false);
		});
	}, [store]);

	return (
		<KeyHandler>
			{isLoading ? (
				<CircularProgress className={clsx("!mx-auto self-center")} />
			) : (
				<Outlet />
			)}
		</KeyHandler>
	);
};
