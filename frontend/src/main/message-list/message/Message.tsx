import { Popover } from "@mui/material";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";
import { useLongPress } from "use-long-press";
import { useMobile } from "../../../hooks/useMobile";
import { usePromise } from "../../../hooks/usePromise";
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
	const isMobile = useMobile();
	const isStreaming = messageStore.chatStore.isStreaming;
	const [open, setOpen] = useState<boolean>(false);
	const refMsg = useRef(null);

	const bind = useLongPress(
		() => {
			if (isMobile && !isStreaming) {
				setOpen(true);
			}
		},
		{
			threshold: 500,
		},
	);

	const [isEditing, setIsEditing] = useState<boolean>(false);

	const onEdit = usePromise({
		func: (newContent) =>
			messageStore.chatStore.onEditMessage(props.msg.data.id, newContent),
		resolve: () => {
			setIsEditing(false);
		},
	});

	let content: any;

	if (isEditing) {
		content = (
			<MsgEditing
				msgStore={props.msg}
				onCancel={() => setIsEditing(false)}
				onSubmit={onEdit.promise}
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
				ref={refMsg}
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
					!isMobile && "group/msg",
				)}
				{...bind()}
			>
				<div
					className={clsx(
						"flex",
						"w-full",
						"justify-between",
						"mb-2",
						"items-center",
						"select-none",
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

			<Popover
				id={"pop"}
				open={open}
				onClose={() => setOpen(false)}
				anchorEl={refMsg.current}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: isUser ? "right" : "left",
				}}
			>
				<div className={clsx("p-4")}>
					<Toolbox
						size={30}
						msg={props.msg}
						onEdit={() => setIsEditing(true)}
						className={clsx()}
					/>
				</div>
			</Popover>
		</div>
	);
});
