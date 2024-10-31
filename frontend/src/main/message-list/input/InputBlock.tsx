import { TextField } from "@mui/material";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { LuSend } from "react-icons/lu";
import { useChatStore } from "../../../hooks/useChatStore";
import { usePromise } from "../../../hooks/usePromise";
import { HoverWrapper } from "../../../ui-kit/HoverWrapper";
import type { VitalProps } from "../../../utils/types";
import { StopBtn } from "./StopBtn";

type InputBlockProps = {} & VitalProps;

export const InputBlock = observer((props: InputBlockProps) => {
	const chatStore = useChatStore();

	const refTextarea = React.useRef<HTMLTextAreaElement>(null);
	const isStreaming = chatStore.isStreaming;

	const [input, setInput] = useState<string>("");

	const onSend = usePromise({
		func: async () => {
			if (input.trim()) {
				setInput("");
				await chatStore.inputMessage(input);
			}
		},
		// reject: () => {
		// 	setInput("");
		// },
	});

	useEffect(() => {
		refTextarea?.current?.focus();
	}, [chatStore, isStreaming]);

	const handleStopStreaming = () => {
		chatStore.stopStreaming();
	};

	const handleKeyDown = (e: any) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			onSend.promise();
		}
	};

	return (
		<div className="relative w-full max-w-[var(--chat-content-width)] mx-auto">
			<TextField
				slotProps={{
					input: {
						ref: refTextarea,
					},
				}}
				autoFocus
				placeholder={isStreaming ? "Generating ..." : "Ask me anything"}
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
				maxRows={20}
				variant="outlined"
				disabled={chatStore.isStreaming}
				// disabled={true}
				// size="sm"
				sx={{
					"--Textarea-radius": "9px",
					"--Textarea-gap": "9px",
					"--Textarea-focusedThickness": "2px",
					"--_Textarea-focusedHighlight": "var(--input-ring)",
					// "--Textarea-minHeight": "50px",

					width: "100%",
					padding: "12px",
					background: "none",
					color: "inherit",
					borderColor: "var(--main-border)",

					"&.Mui-disabled": {
						borderColor: "var(--main-border)",
						opacity: "50%",
					},
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
						<LuSend
							onClick={() => {
								onSend.promise();
							}}
							size={22}
						/>
					</HoverWrapper>
				)}
			</div>
		</div>
	);
});
