import React, { FC, useContext } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import type { VitalProps } from "../utils/types";
import type { ChatStore } from "../store/chat.store";
import { useGlobalStore } from "../store/global.store";
import useModifierKeys from "../hooks/useModifierKeys";
import { MdCleaningServices } from "react-icons/md";

type ChatItemProps = {
	workspaceId: number;
	chat: ChatStore;
} & VitalProps;

export const ChatItem = observer((props: ChatItemProps) => {
	const store = useGlobalStore();
	const isModifierPressed = useModifierKeys();
	const { id, name, default: def } = props.chat.chat;
	const isActive = id === store.openChatId;

	const openChat = (chatId: number) => {
		store.selectChat(chatId);
	};

	const deleteChat = (chatId: number) => {
		store.deleteChat(chatId);
	};

	const clearChat = (chatId: number) => {
		store.clearChat(chatId);
	};

	const showDeleteIcon = isModifierPressed;

	return (
		<div
			onClick={() => openChat(id)}
			className={clsx(
				isActive
					? "text-gray-200 hover:bg-[var(--hover-chat)]"
					: "hover:bg-[var(--hover-chat)] text-gray-500",
				"items-stretch",
				"rounded-lg",
				"select-none",
				"cursor-pointer",
				"flex items-center",
				"overflow-hidden",
				props.className,
			)}
		>
			<div className={clsx("flex-1 p-2")}>
				<h1 className={clsx("line-clamp-1 pr-2 text-[14px]")}>{name} </h1>
			</div>

			<div
				onClick={(e) => {
					e.stopPropagation();

					if (def) {
						clearChat(id);
					} else {
						deleteChat(id);
					}
				}}
				className={clsx(
					showDeleteIcon ? "block" : "hidden",
					"flex items-center justify-center",
					"opacity-30 hover:opacity-100",
					"text-white",
					def ? "bg-orange-400" : "bg-red-400",
					"w-[40px]",
				)}
			>
				{def ? (
					<MdCleaningServices size={18} className={clsx("mr-1")} />
				) : (
					<IoCloseSharp size={20} className={clsx("mr-1")} />
				)}
			</div>
		</div>
	);
});
