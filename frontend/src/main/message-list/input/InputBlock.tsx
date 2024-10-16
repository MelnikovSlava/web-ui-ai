import React, { FC, KeyboardEvent, useEffect } from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import { Textarea } from "@mui/joy";
import type { VitalProps } from "../../../utils/types";
import { store, useRootStore } from "../../../store/root.store";
import type { ChatStore } from "../../../store/chat.store";
import { LuSend } from "react-icons/lu";
import { StopBtn } from "./StopBtn";
import { HoverWrapper } from "../../../ui-kit/HoverWrapper";

type InputBlockProps = {} & VitalProps;

export const InputBlock = observer((props: InputBlockProps) => {
	const storeGlobal = useRootStore();
	const chatStore = storeGlobal.currentChatStore as ChatStore;
	const refTextarea = React.useRef<HTMLTextAreaElement>(null);
	const isStreaming = chatStore.isStreaming;

	useEffect(() => {
		refTextarea?.current?.focus();
	}, [chatStore, isStreaming]);

	const handleSendMessage = async () => {
		if (chatStore.input?.trim()) {
			await chatStore.inputMessage(chatStore.input);
		}
	};

	const handleStopStreaming = () => {
		chatStore.stopStreaming();
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<div className="relative w-full max-w-[var(--chat-content-width)] mx-auto">
			<Textarea
				slotProps={{
					textarea: {
						ref: refTextarea,
					},
				}}
				autoFocus
				placeholder={isStreaming ? 'Generating ...' : "Ask me anything"}
				value={chatStore.input}
				onChange={(e) => chatStore.setInput(e.target.value)}
				onKeyDown={handleKeyDown}
				maxRows={20}
				variant="outlined"
				disabled={chatStore.isStreaming}
				// disabled={true}
				size="sm"
				sx={{
					"--Textarea-radius": "9px",
					"--Textarea-gap": "9px",
					"--Textarea-focusedThickness": "2px",
					"--_Textarea-focusedHighlight": "var(--input-ring)",
					// "--Textarea-minHeight": "50px",

					width: '100%',
					padding: "12px",
					background: "none",
					color: "inherit",
					borderColor: "var(--main-border)",

					"&.Mui-disabled": {
						borderColor: "var(--main-border)",
						opacity: '50%',
					}
				}}
			/>
			<div
				className={clsx(
					"absolute top-[5.5px] right-[6px]",
					// "border-b-orange-300 border",
				)}
			>
				{isStreaming ? (
					<StopBtn onClick={handleStopStreaming} />
				) : (
					<HoverWrapper
						className={clsx(
							"flex items-center justify-center",
							"h-[36px] w-[36px]",
						)}
					>
						<LuSend onClick={handleSendMessage} size={22} />
					</HoverWrapper>
				)}
			</div>
		</div>
	);
});
