import { CircularProgress } from "@mui/joy";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { KeyHandler } from "./layouts/KeyHandler";
import { useRootStore } from "./store/root.store";
import { delayPromise } from "./utils/utils";

export const App = () => {
	const rootStore = useRootStore();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		delayPromise(
			Promise.all([rootStore.getDataAction(), rootStore.aiStore.fetchModels()]),
			// Promise.all([rootStore.getDataAction()]),
		).then(() => {
			setIsLoading(false);
		});
	}, [rootStore]);

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
