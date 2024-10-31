import { InputAdornment, TextField } from "@mui/material";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useMemo, useState } from "react";
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

	const disabled = useMemo(() => {
		return isStreaming;
	}, [isStreaming]);

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
						endAdornment: (
							<InputAdornment position="end">
								<div
									className={clsx(
										// "absolute top-[5.5px] right-[6px]",
										// "border-b-orange-300 border",
									)}
								>
									{isStreaming ? (
										<StopBtn onClick={handleStopStreaming} />
									) : (
										<HoverWrapper
											disabled={disabled}
											className={clsx(
												"flex items-center justify-center",
												"h-[36px] w-[36px]",
											)}
										>
											<LuSend
												onClick={() => {
													if (!disabled) {
														onSend.promise();
													}
												}}
												size={22}
											/>
										</HoverWrapper>
									)}
								</div>
							</InputAdornment>
						),
					},
				}}
				autoFocus
				placeholder={isStreaming ? "Generating ..." : "Ask me anything"}
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
				maxRows={20}
				multiline
				variant="outlined"
				disabled={disabled}
				// size="sm"
				sx={{
					"& .MuiOutlinedInput-root": {
						borderRadius: "9px",
						padding: "4px 10px 4px 4px",
					},

					width: "100%",
				}}
			/>
		</div>
	);
});
