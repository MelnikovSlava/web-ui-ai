import React, { FC, useEffect, useRef } from 'react';
import hljs from "highlight.js";
import { Marked, Renderer } from "marked";
import { markedHighlight } from "marked-highlight";
import markedKatex from "marked-katex-extension";
import { useClipboard } from "../../../hooks/useClipboard";
import type { VitalProps } from '../../../utils/types';
import type { Message } from '../../../store/types';
import { observer } from 'mobx-react-lite';


type MsgContentProps = {
  msg: Message;
} & VitalProps;

export const MsgContent = observer((props: MsgContentProps) => {
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
				    <button class='text-xs copy-action hidden group-hover/item:block p-2 rounded-lg absolute z-10 top-4 right-2 bg-gray-600 border-gray-400 border opacity-20 hover:opacity-100 active:opacity-30'>
				      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy pointer-events-none text-gray-100"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
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
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{
        __html: isUser ? `<p>${props.msg.content}</p>` : parsedText,
      }}
    />
  );
});