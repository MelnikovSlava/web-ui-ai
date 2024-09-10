import React, { FC, useContext } from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { VitalProps } from "../../../utils/types";
import { IconWrapper } from "../../../ui-kit/IconWrapper";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbCopy } from "react-icons/tb";
import { GrUpdate } from "react-icons/gr";
import { GrEdit } from "react-icons/gr";
import { MdForkRight } from "react-icons/md";

type ToolboxProps = {
	isUser: boolean;
} & VitalProps;

export const Toolbox = observer((props: ToolboxProps) => {
	return (
		<div className={clsx("flex", props.className)}>
			<IconWrapper className={clsx("ml-1")}>
				<RiDeleteBinLine />
			</IconWrapper>

			<IconWrapper className={clsx("ml-1")}>
				<TbCopy />
			</IconWrapper>

			<IconWrapper className={clsx("ml-1")}>
				<GrUpdate size={12} />
			</IconWrapper>

			<IconWrapper className={clsx("ml-1")}>
				<GrEdit size={14} />
			</IconWrapper>

			<IconWrapper className={clsx("ml-1")}>
				<MdForkRight size={18} />
			</IconWrapper>
		</div>
	);
});
