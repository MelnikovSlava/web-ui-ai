import React, { FC } from "react";
import clsx from "clsx";
import { VitalProps } from "../utils/types";
import { CgAddR } from "react-icons/cg";
import { IoIosAddCircle } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";

type AddNewChatBtnProps = {
	onClick: () => void;
} & VitalProps;

export const AddNewChatBtn = (props: AddNewChatBtnProps) => {
	return (
		<div
			className={clsx(
				"flex items-center text-[14px]",
				"px-1 py-2",
				"select-none",
				"cursor-pointer",
				"opacity-40 hover:opacity-100",
				props.className,
			)}
			onClick={props.onClick}
		>
			<IoIosAddCircleOutline size={20} />
			<span className={clsx("ml-1")}>Add</span>
		</div>
	);
};
