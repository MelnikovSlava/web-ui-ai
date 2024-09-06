import React, { FC } from "react";
import clsx from "clsx";
import type { VitalProps } from "../utils/types";
import { IoIosAdd } from "react-icons/io";
import { Button } from "@mui/joy";

type CreateNewWBtnProps = {
	onClick?: () => void;
} & VitalProps;

export const CreateNewWBtn = (props: CreateNewWBtnProps) => {
	return (
		<Button
			onClick={props.onClick}
			startDecorator={<IoIosAdd size={22} />}
			className={clsx("", props.className)}
			size="md"
			variant="outlined"
			sx={{
				background: "none",
				color: "inherit",
				height: "46px",
				borderColor: "white",
				opacity: "60%",
				width: "100%",

				"&:hover": {
					background: "none",
					color: "inherit",
					opacity: "100%",
				},
			}}
		>
			Create new space
		</Button>
	);
};
