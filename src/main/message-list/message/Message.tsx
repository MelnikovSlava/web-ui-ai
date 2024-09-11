import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import type { VitalProps } from "../../../utils/types";
import { MessageBase, Message as MsgType } from "../../../store/types";
import { Toolbox } from "./Toolbox";
import { Avatar } from "./Avatar";
import { useGlobalStore } from "../../../store/global.store";
import { MsgContent } from "./MsgContent";
import { MsgEditing } from "./MsgEditing";

type MessageProps = {
	msg: MsgType;
} & VitalProps;

export const Message = observer((props: MessageProps) => {
	const store = useGlobalStore();
	const isUser = props.msg.role === "user";
	const isStreaming = store.aiStore.isStreaming;

	const [isEditing, setIsEditing] = useState<boolean>(false);

	const onSubmitEdited = (newContent: string) => {
		const chatStore = store.currentChatStore;
		chatStore?.onEditMessage(props.msg.id, newContent);

		setIsEditing(false);
	};

	return (
		<div
			className={clsx(
				"message",
				"w-full",
				"mb-5",
				"flex flex-col",
				isUser ? "items-end" : "items-start",
				props.className,
			)}
		>
			<div
				className={clsx(
					isUser
						? "bg-[var(--msg-user-body)] border-[var(--msg-user-border)]"
						: "bg-[var(--msg-assistent-body)] border-[var(--msg-assistent-border)]",
					isUser && "whitespace-pre-line",
					"border",
					"overflow-hidden",
					"rounded-xl",
					"py-3 px-4",
					"mb-2",
					"min-w-[140px]",
					// "w-full",
					isUser && "max-w-[96%]",
					"group/msg",
				)}
			>
				<div
					className={clsx(
						"flex",
						"w-full",
						"justify-between",
						"mb-2",
						"items-center",
					)}
				>
					<Avatar isUser={isUser} />
					<Toolbox
						msg={props.msg as MsgType}
						onEdit={() => setIsEditing(true)}
						className={clsx(
							"ml-10",
							"invisible",
							!isStreaming && "group-hover/msg:visible",
						)}
					/>
				</div>

				{isEditing ? (
					<MsgEditing
						msg={props.msg}
						onCancel={() => setIsEditing(false)}
						onSubmit={onSubmitEdited}
					/>
				) : (
					<MsgContent msg={props.msg} />
				)}
			</div>
		</div>
	);
});
