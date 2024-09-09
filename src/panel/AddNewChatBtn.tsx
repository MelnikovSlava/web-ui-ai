import React, { FC } from "react";
import clsx from "clsx";
import { VitalProps } from "../utils/types";
import { IoIosAddCircleOutline } from "react-icons/io";
import { HoverWrapper } from "../ui-kit/HoverWrapper";

type AddNewChatBtnProps = {
	onClick: () => void;
} & VitalProps;

export const AddNewChatBtn = (props: AddNewChatBtnProps) => {
	return (
		<HoverWrapper
			className={clsx(
				"flex items-center text-[14px]",
				"px-1 py-2",
				props.className,
			)}
			onClick={props.onClick}
		>
			<IoIosAddCircleOutline size={20} />
			<span className={clsx("ml-1")}>Add</span>
		</HoverWrapper>
	);
};
