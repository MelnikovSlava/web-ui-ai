import clsx from "clsx";
import { observer } from "mobx-react-lite";
import {} from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import { useUrlChatId } from "../hooks/useUrlChatId";
import { useUrlWorkspaceId } from "../hooks/useUrlWorkspaceId";
import { routes } from "../router";
import type { ChatStore } from "../store/chat.store";
import { IconWrapper } from "../ui-kit/IconWrapper";
import { INIT_CHAT_TITLE } from "../utils/constants";
import type { VitalProps } from "../utils/types";

type ChatItemProps = {
	chat: ChatStore;
} & VitalProps;

export const ChatItem = observer((props: ChatItemProps) => {
	const navigate = useNavigate();
	const chatStore = props.chat;

	const urlWorkspaceId = useUrlWorkspaceId();
	const urlChatId = useUrlChatId();
	const isActive = urlChatId === chatStore.data.id;

	const deleteChat = (chatId: number) => {
		if (isActive) {
			let route: string;

			const otherChats = chatStore.workspace.chats.filter(
				(c) => c.data.id !== chatId,
			);

			if (otherChats.length > 0) {
				const lastOtherChat = otherChats[otherChats.length - 1];

				route = routes.chat(urlWorkspaceId, lastOtherChat.data.id);
			} else {
				route = routes.workspace(urlWorkspaceId);
			}

			navigate(route);
		}

		props.chat.workspace.deleteChatAction(chatId);
	};

	return (
		<div
			onClick={() => {
				navigate(routes.chat(urlWorkspaceId, chatStore.data.id));
			}}
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
			<h1 className={clsx("line-clamp-1 pr-2 text-[14px] flex-1")}>
				{props.chat.data.name || INIT_CHAT_TITLE}
			</h1>

			<div
				onClick={(e) => {
					e.stopPropagation();
					deleteChat(chatStore.data.id);
				}}
				className={clsx("group-hover/chat:opacity-100 opacity-0")}
			>
				<IconWrapper className={clsx("")}>
					<RiDeleteBinLine size={15} />
				</IconWrapper>
			</div>
		</div>
	);
});
