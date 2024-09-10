import React, { FC, useContext, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";
import type { VitalProps } from "../../../utils/types";
import type { MessageBase } from "../../../store/types";
import hljs from "highlight.js";
import { Marked, Renderer, marked } from "marked";
import { markedHighlight } from "marked-highlight";
import markedKatex from "marked-katex-extension";
import { useClipboard } from "../../../hooks/useClipboard";

type MessageProps = {
	msg: MessageBase;
} & VitalProps;

export const Message = observer((props: MessageProps) => {
	const isUser = props.msg.role === "user";

	const clipboard = useClipboard({ timeout: 1000 });

	const codeBlockCopyEvent = useRef((e: Event) => {
		const target: HTMLElement = e.target as HTMLElement;
		if (typeof target.className !== "string") return null;

		const isCopyActionClassName = target?.className.includes("copy-action");

		if (isCopyActionClassName) {
			const content =
				target?.parentNode?.querySelector("code")?.innerText ?? "";
			clipboard.copy(content);
		}
	});

	useEffect(() => {
		document.addEventListener("click", codeBlockCopyEvent.current);
		return () => {
			document.removeEventListener("click", codeBlockCopyEvent.current);
		};
	}, []);

	const marked: Marked = new Marked(
		markedHighlight({
			langPrefix: "hljs",
			highlight: (code, lang) => {
				if (lang === undefined || lang === "") {
					return hljs.highlightAuto(code).value;
				}
				try {
					return hljs.highlight(code, { language: lang }).value;
				} catch (err) {
					return hljs.highlight(code, { language: "javascript" }).value;
				}
			},
		}),
		{
			renderer: {
				link: (href: string, title: string, text: string) => {
					return Renderer.prototype.link
						?.apply(this, [href, title, text])
						.replace("<a", "<a target='_blank'");
				},
				code: (code: string, lang: string) => {
					return `
				  <div class="relative code-block group/item overflow-auto">
				    <button class='text-xs copy-action hidden group-hover/item:block p-2 rounded-lg absolute top-4 right-2'>
				      ${
								clipboard.copied
									? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check pointer-events-none text-green-600"><path d="M20 6 9 17l-5-5"/></svg>`
									: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy pointer-events-none text-gray-400"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
							}
				    </button>
				    <pre class="hljs">
				      <code class="language-${lang ?? ""}">${code}</code>
				    </pre>
				  </div>
				  `;
				},
			},
		},
	);

	marked.use(markedKatex({ throwOnError: false }));

	const parsedText = marked.parse(props.msg.content);

	return (
		<div
			className={clsx(
				"message",
				"w-full",
				// "max-w-[800px]",
				"mb-5",
				"flex",
				isUser ? "justify-end" : "justify-start",
				props.className,
			)}
		>
			<div
				className={clsx(
					isUser
						? "bg-msg-user-body border-msg-user-border"
						: "bg-msg-assistent-body border-msg-assistent-border",
					"border",
					"overflow-hidden",
					"rounded-xl",
					"py-3 px-4",
				)}
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: isUser ? props.msg.content : parsedText,
				}}
			/>
		</div>
	);
});
