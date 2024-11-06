import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import { useMobile } from "../../../hooks/useMobile";
import { useUrlChatId } from "../../../hooks/useUrlChatId";
import { useUrlWorkspaceId } from "../../../hooks/useUrlWorkspaceId";
import { routes } from "../../../router";
import type { ChatStore } from "../../../store/chat.store";
import { IconWrapper } from "../../../ui-kit/IconWrapper";
import type { VitalProps } from "../../../utils/types";
import { ChatTitle } from "./ChatTitle";

type ChatItemProps = {
	chat: ChatStore;
	onClick?: (e?: any) => void
} & VitalProps;

export const ChatItem = observer((props: ChatItemProps) => {
	const navigate = useNavigate();
	const isMobile = useMobile();
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

	const onClick = (e: any) => {
		navigate(routes.chat(urlWorkspaceId, chatStore.data.id));

		if (props?.onClick) {
			props.onClick(e);
		}
	};

	return (
		<div
			onClick={isMobile ? undefined : onClick}
			onTouchStart={isMobile ? onClick : undefined}
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

			<ChatTitle title={props.chat.data.name} className={clsx('pr-2', 'flex-1')} />

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
