"use client";

import { CircularProgress } from "@mui/joy";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useRootStore } from "../store/root.store";
import type { VitalProps } from "../utils/types";
import { delayPromise } from "../utils/utils";
import { KeyHandler } from "./KeyHandler";

export const App = (props: VitalProps) => {
	const rootStore = useRootStore();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		delayPromise(
			Promise.all([rootStore.getDataAction(), rootStore.aiStore.fetchModels()]),
		).then(() => {
			setIsLoading(false);
		});
	}, [rootStore]);

	return (
		<KeyHandler>
			{isLoading ? (
				<CircularProgress className={clsx("!mx-auto self-center")} />
			) : (
				props.children
			)}
		</KeyHandler>
	);
};
