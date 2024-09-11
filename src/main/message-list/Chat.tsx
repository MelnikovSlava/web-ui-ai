import React, { FC, Fragment, useContext } from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import type { VitalProps } from "../../utils/types";
import { useGlobalStore } from "../../store/global.store";
import { InputBlock } from "./input/InputBlock";
import { Message } from "./message/Message";
import { MainLayout } from "../../layouts/MainLayout";
import ListContainer from "../../layouts/ListContainer";
import { Created } from "./Created";
import { Empty } from "./Empty";

type ChatProps = {} & VitalProps;

export const Chat = observer((props: ChatProps) => {
	const storeGlobal = useGlobalStore();
	const chatStore = storeGlobal.currentChatStore;

	if (!chatStore) {
		return null;
	}

	return (
		<MainLayout
			className={clsx(
				// "px-5",
				"text-[var(--chat-color-text)] text-[15px]",
				props.className,
			)}
		>
			{chatStore.messages.length > 0 ? (
				<ListContainer
					store={chatStore}
					className={clsx(
						"px-5",
						"flex flex-col ",
						"h-full w-full",
						"overflow-x-hidden",
					)}
				>
					<div
						className={clsx(
							// "flex-1 overflow-auto",
							"mx-auto",
							"w-full max-w-[var(--chat-content-width)]",
						)}
					>
						<Created timestamp={chatStore.chat.timestamp} />

						{chatStore.messages.map((message) => {
							return <Message msg={message} key={message.id} />;
						})}

						{chatStore.currentStreamedMessage.content && (
							<Message msg={chatStore.currentStreamedMessage} />
						)}
					</div>
				</ListContainer>
			) : (
				<Empty />
			)}

			<div className={clsx("py-4 w-full px-5")}>
				<InputBlock />
			</div>
		</MainLayout>
	);
});
