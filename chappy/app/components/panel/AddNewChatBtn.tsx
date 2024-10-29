"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { IoIosAddCircleOutline } from "react-icons/io";
import { usePromise } from "../../hooks/usePromise";
import { useUrlWorkspaceId } from "../../hooks/useUrlWorkspaceId";
import { routes } from "../../routers";
import type { WorkspaceStore } from "../../store/workspace.store";
import type { VitalProps } from "../../utils/types";
import { HoverWrapper } from "../ui-kit/HoverWrapper";

type AddNewChatBtnProps = {
	workspace: WorkspaceStore;
} & VitalProps;

export const AddNewChatBtn = (props: AddNewChatBtnProps) => {
	const router = useRouter();
	const urlWorkspaceId = useUrlWorkspaceId();
	const chatStore = props.workspace;

	const onCreateChat = usePromise({
		func: chatStore.createChatAction,
		resolve: (response) => {
			router.push(routes.chat(urlWorkspaceId, response?.data.id));
		},
	});

	return (
		<HoverWrapper
			className={clsx(
				"flex items-center text-[14px]",
				"px-1 py-2",
				props.className,
			)}
			onClick={() => {
				onCreateChat.promise();
			}}
		>
			<IoIosAddCircleOutline size={16} />
			<span className={clsx("ml-1")}>Add</span>
		</HoverWrapper>
	);
};
