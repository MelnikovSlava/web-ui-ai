import React, { FC, useContext } from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import type { VitalProps } from "../utils/types";
import type { ChatStore } from "../store/chat.store";
import { useGlobalStore } from "../store/global.store";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdCleaningServices } from "react-icons/md";
import { IconWrapper } from "../ui-kit/IconWrapper";
import { DEFAULT_CHAT_TITLE, INIT_CHAT_TITLE } from "../utils/constants";

type ChatItemProps = {
	workspaceId: number;
	chat: ChatStore;
} & VitalProps;

export const ChatItem = observer((props: ChatItemProps) => {
	const store = useGlobalStore();
	const chatId = props.chat.chat.id;
	const isDefault = props.chat.isDefault;
	const isActive = chatId === store.openChatId;
	const chatName = props.chat.chat.name || INIT_CHAT_TITLE;

	const openChat = (chatId: number) => {
		store.selectChat(chatId);
	};

	const deleteChat = (chatId: number) => {
		store.deleteChat(chatId);
	};

	const clearChat = (chatId: number) => {
		store.clearChat(chatId);
	};

	return (
		<div
			onClick={() => openChat(chatId)}
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
				"p-2",
				"group/chat",
				props.className,
			)}
		>
			<h1 className={clsx("line-clamp-1 pr-2 text-[14px] flex-1")}>{isDefault ? DEFAULT_CHAT_TITLE : chatName}</h1>

			<div
				onClick={(e) => {
					e.stopPropagation();

					if (isDefault) {
						clearChat(chatId);
					} else {
						deleteChat(chatId);
					}
				}}
				className={clsx(
					"group-hover/chat:opacity-100 opacity-0"
				)}
			>
				<IconWrapper className={clsx('')}>
					{isDefault ? (
						<MdCleaningServices size={15} />
					) : (
						<RiDeleteBinLine size={15} />
					)}
				</IconWrapper>
			</div>
		</div>
	);
});
