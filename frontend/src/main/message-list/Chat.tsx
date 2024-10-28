import clsx from "clsx";
import { observer } from "mobx-react-lite";
import {} from "react";
import ListContainer from "../../layouts/ListContainer";
import { MainLayout } from "../../layouts/MainLayout";
import { Created } from "./Created";
import { Empty } from "./Empty";
import { InputBlock } from "./input/InputBlock";
import { Message } from "./message/Message";
import { useChatStore } from "./useChatStore";

export const Chat = observer(() => {
	const chatStore = useChatStore();

	if (!chatStore) {
		return null;
	}

	return (
		<MainLayout
			className={clsx(
				// "px-5",
				"text-[var(--chat-color-text)] text-[15px]",
			)}
		>
			{chatStore.messages.length > 0 ? (
				<ListContainer
					chatStore={chatStore}
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
						<Created timestamp={chatStore.timestamp} />

						{chatStore.messages.map((message) => {
							return <Message msg={message} key={message.id} />;
						})}
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
