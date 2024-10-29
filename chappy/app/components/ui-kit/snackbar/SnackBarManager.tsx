'use client';

import { Slide, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { observer } from "mobx-react-lite";

import { SnackbarManagerInstance } from "./snackbar-manager";
import type { FC } from "react";

function TransitionLeft(props: any) {
	return <Slide {...props} direction="left" />;
}

export const SnackBarManager: FC = observer(function SnackBarManager() {
	const { data, closeSnackbar } = SnackbarManagerInstance;

	if (!data?.open) {
		return null;
	}

	return (
		<Snackbar
			onClose={closeSnackbar}
			TransitionComponent={TransitionLeft}
			{...data}
		>
			<MuiAlert
				severity={data.type}
				elevation={2}
				variant="filled"
				classes={{
					filled: `${data.type === "success" && "!bg-br-ok"}`,
				}}
				sx={{
					borderRadius: "12px",
				}}
			>
				{data.message}
			</MuiAlert>
		</Snackbar>
	);
});
