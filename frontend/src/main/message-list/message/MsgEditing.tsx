import { Button, TextField } from "@mui/material";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import { type KeyboardEvent, useRef, useState } from "react";
import type { MessageStore } from "../../../store/message.store";
import type { VitalProps } from "../../../utils/types";

type MsgEditingProps = {
	msgStore: MessageStore;
	onCancel: () => void;
	onSubmit: (content: string) => void;
} & VitalProps;

export const MsgEditing = observer((props: MsgEditingProps) => {
	const content = props.msgStore.data.content;
	const hold = useRef(content);
	const [value, setValue] = useState<string>(content);

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			props.onSubmit(value);
		}
	};

	return (
		<div className={clsx("flex flex-col")}>
			{/* this is hack for textarea width */}
			<p className={clsx("invisible h-0 !my-0")}>{hold.current}</p>
			<TextField
				autoFocus
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleKeyDown}
				maxRows={20}
				multiline
				variant="outlined"
				// size="sm"
				sx={{
					"& .MuiOutlinedInput-root": {
						padding: "4px",
					},

					background: "none",
					color: "inherit",
					// borderColor: "var(--main-border)",
					marginBottom: "8px",
				}}
			/>
			<div className={clsx("flex")}>
				<Button
					size="small"
					variant="contained"
					className={clsx("!mr-2")}
					onClick={() => props.onSubmit(value)}
				>
					Submit
				</Button>
				<Button size="small" variant="outlined" onClick={props.onCancel}>
					Cancel
				</Button>
			</div>
		</div>
	);
});
