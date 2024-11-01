import { CircularProgress } from "@mui/material";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useRootStore } from "../store/root.store";
import { delayPromise } from "../utils/utils";

export const DataFetcher = () => {
	const rootStore = useRootStore();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		delayPromise(
			Promise.all([rootStore.getDataAction(), rootStore.aiStore.fetchModels()]),
		).then(() => {
			setIsLoading(false);
		});
	}, [rootStore]);

	if (isLoading) {
		return <CircularProgress className={clsx("!mx-auto self-center")} />;
	}

	return <Outlet />;
};
