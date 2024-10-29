import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import type { MessageStore } from "../../../store/message.store";
import { LoaderDots } from "../../../ui-kit/LoaderDots";
import type { VitalProps } from "../../../utils/types";
import { Avatar } from "./Avatar";
import { MsgContent } from "./MsgContent";
import { MsgEditing } from "./MsgEditing";
import { Toolbox } from "./Toolbox";

type MessageProps = {
	msg: MessageStore;
} & VitalProps;

export const Message = observer((props: MessageProps) => {
	const messageStore = props.msg;
	const isUser = messageStore.data.role === "user";
	const isStreaming = messageStore.chatStore.workspace.root.aiStore.isStreaming;

	const [isEditing, setIsEditing] = useState<boolean>(false);

	const onSubmitEdited = (newContent: string) => {
		messageStore.chatStore.onEditMessage(props.msg.data.id, newContent);

		setIsEditing(false);
	};

	let content: any;

	if (isEditing) {
		content = (
			<MsgEditing
				msg={props.msg.data}
				onCancel={() => setIsEditing(false)}
				onSubmit={onSubmitEdited}
			/>
		);
	} else {
		if (!isUser && props.msg.data.content === "") {
			content = <LoaderDots className={clsx("!mt-4 !mb-2.5")} />;
		} else {
			content = <MsgContent msg={props.msg.data} />;
		}
	}

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
						msg={props.msg}
						onEdit={() => setIsEditing(true)}
						className={clsx(
							"ml-10",
							"invisible",
							!isStreaming && "group-hover/msg:visible",
						)}
					/>
				</div>

				{content}
			</div>
		</div>
	);
});
