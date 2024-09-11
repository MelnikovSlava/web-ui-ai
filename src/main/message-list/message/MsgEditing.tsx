import React, { FC, type KeyboardEvent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import type { Message } from "../../../store/types";
import type { VitalProps } from "../../../utils/types";
import { Button, Textarea } from "@mui/joy";

type MsgEditingProps = {
  msg: Message;
  onCancel: () => void;
  onSubmit: (content: string) => void;
} & VitalProps;

export const MsgEditing = observer((props: MsgEditingProps) => {
  const [value, setValue] = useState<string>(props.msg.content);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      props.onSubmit(value);
    }
  };

  return (
    <div className={clsx("flex flex-col")}>
      {/* this is hack for textarea width */}
      <p className={clsx("invisible h-0 !my-0")}>{value}</p>
      <Textarea
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        maxRows={20}
        variant="outlined"
        size="sm"
        sx={{
          "--Textarea-radius": "9px",
          "--Textarea-gap": "9px",
          "--Textarea-focusedThickness": "1px",
          "--_Textarea-focusedHighlight": "var(--input-ring)",

          width: "100%",
          resize: "none",
          padding: "12px",
          background: "none",
          color: "inherit",
          borderColor: "var(--main-border)",
          marginBottom: "8px",
        }}
      />
      <div className={clsx("flex")}>
        <Button
          size="sm"
          className={clsx("!mr-2")}
          onClick={() => props.onSubmit(value)}
        >
          Submit
        </Button>
        <Button size="sm" variant="outlined" onClick={props.onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
});
