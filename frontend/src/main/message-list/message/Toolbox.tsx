import clsx from "clsx";
import { observer } from "mobx-react-lite";
import {} from "react";
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
} & VitalProps;

const SIZE = 15;

export const Toolbox = observer((props: ToolboxProps) => {
	const navigate = useNavigate();
	const urlWorkspaceId = useUrlWorkspaceId();
	const { copy } = useClipboard();

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
			icon: <TbCopy size={SIZE} />,
			onClick: () => copy(props.msg.data.content),
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
			onClick: () => {
				if (!onFork.loading) {
					onFork.promise();
				}
			},
			show: !isUser,
		},
		{
			icon: <RiDeleteBinLine size={SIZE} />,
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
