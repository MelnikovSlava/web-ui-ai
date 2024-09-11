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
import { IoMdMore } from "react-icons/io";
import { useClipboard } from "../../../hooks/useClipboard";
import { Message } from "../../../store/types";
import { useGlobalStore } from "../../../store/global.store";

type ToolboxProps = {
	msg: Message;
	onEdit: () => void;
} & VitalProps;

const SIZE = 15;

export const Toolbox = observer((props: ToolboxProps) => {
	const store = useGlobalStore();
	const currentChat = store.currentChatStore;
	const { copy } = useClipboard();

	const isUser = props.msg.role === 'user';

	const items = [
		{
			icon: <TbCopy size={SIZE} />,
			onClick: () => copy(props.msg.content),
			show: true,
		},
		// {
		// 	icon: <GrUpdate size={SIZE - 4} />,
		// 	onClick: () => { },
		// 	show: !isUser,
		// },
		{
			icon: <GrEdit size={SIZE - 2} />,
			onClick: props.onEdit,
			show: isUser,
		},
		{
			icon: <MdForkRight size={SIZE} />,
			onClick: () => currentChat?.forkChat(props.msg.id),
			show: !isUser,
		},
		{
			icon: <RiDeleteBinLine size={SIZE} />,
			onClick: () => currentChat?.deleteMessage(props.msg),
			show: true,
		},
	];

	return (
		<div className={clsx("flex", props.className)}>
			{items.map((item, i) => {
				if (!item.show) {
					return null;
				}

				return (
					<IconWrapper
						key={i}
						className={clsx("ml-0.5")}
						onClick={item.onClick}
					>
						{item.icon}
					</IconWrapper>
				);
			})}
		</div>
	);
});
