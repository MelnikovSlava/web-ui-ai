'use client';

import type { AlertProps, SnackbarProps } from "@mui/material";
import { makeAutoObservable } from "mobx";

export type CustomSnackbar = SnackbarProps & {
	type?: AlertProps["severity"];
};

export class SnackbarManager {
	public data: CustomSnackbar | null;

	public constructor() {
		this.data = null;

		makeAutoObservable(this);
	}

	public closeSnackbar = () => {
		this.data = { ...this.data, open: false };
	};

	public showSnackbar = (data: CustomSnackbar) => {
		const {
			autoHideDuration = 2600,
			message,
			open = true,
			type = "success",
			anchorOrigin = { horizontal: "right", vertical: "top" },
			...rest
		} = data;

		this.data = {
			autoHideDuration,
			open,
			message,
			anchorOrigin,
			type,
			...rest,
		};
	};
}

export const SnackbarManagerInstance = new SnackbarManager();

export const useSnackbar = () => {
	return (data: CustomSnackbar) => SnackbarManagerInstance.showSnackbar(data);
};

export const useShowErrorNotification = () => {
	const showSnackbar = useSnackbar();

	return (message = "Something is wrong!") =>
		showSnackbar({
			message,
			type: "error",
		});
};

export const useShowSuccessNotification = () => {
	const showSnackbar = useSnackbar();

	return (message: string) =>
		showSnackbar({
			message,
			type: "success",
		});
};

export const useShowWarnNotification = () => {
	const showSnackbar = useSnackbar();

	return (message: string) =>
		showSnackbar({
			message,
			type: "warning",
		});
};
