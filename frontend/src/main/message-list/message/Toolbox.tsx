import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { GrEdit } from "react-icons/gr";
import { MdForkRight } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbCopy } from "react-icons/tb";
import { useNavigate } from "react-router";
import { useClipboard } from "../../../hooks/useClipboard";
import { usePromise } from "../../../hooks/usePromise";
import { useUrlWorkspaceId } from "../../../hooks/useUrlWorkspaceId";
import { routes } from "../../../router";
import type { MessageStore } from "../../../store/message.store";
import { IconWrapper } from "../../../ui-kit/IconWrapper";
import type { VitalProps } from "../../../utils/types";

type ToolboxProps = {
	msg: MessageStore;
	onEdit: () => void;
	size?: number;
} & VitalProps;

export const Toolbox = observer((props: ToolboxProps) => {
	const navigate = useNavigate();
	const urlWorkspaceId = useUrlWorkspaceId();
	const { copy } = useClipboard();
	const [size] = useState<number>(props.size ?? 15);

	const messageStore = props.msg;

	const isUser = messageStore.data.role === "user";

	const onFork = usePromise({
		func: () => messageStore.chatStore.workspace.forkChat(messageStore),
		resolve: (response) => {
			const newChat = response?.data.chat;

			navigate(routes.chat(urlWorkspaceId, newChat?.id));
		},
	});

	const onDelete = usePromise({
		func: () => messageStore.chatStore.deleteMessages([messageStore.data.id]),
	});

	const items = [
		{
			icon: <TbCopy size={size} />,
			onClick: () => copy(props.msg.data.content),
			show: true,
		},
		// {
		// 	icon: <GrUpdate size={SIZE - 4} />,
		// 	onClick: () => { },
		// 	show: !isUser,
		// },
		{
			icon: <GrEdit size={size - 2} />,
			onClick: props.onEdit,
			show: isUser,
		},
		{
			icon: <MdForkRight size={size} />,
			onClick: () => {
				if (!onFork.loading) {
					onFork.promise();
				}
			},
			show: !isUser,
		},
		{
			icon: <RiDeleteBinLine size={size} />,
			onClick: () => onDelete.promise(),
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
						size={size + 9}
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
