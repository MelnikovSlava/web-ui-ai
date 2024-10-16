// import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ReactNode, useCallback, useEffect, useRef } from "react";
import { VitalProps } from "../utils/types";
import clsx from "clsx";
import { ScrollArea } from "./ScrollArea";
import { observer } from "mobx-react-lite";
import { ChatStore } from "../store/chat.store";

type Props = {
	store: ChatStore;
} & VitalProps;

const ListContainer = observer((props: Props) => {
	const listRef = useRef<HTMLDivElement>(null);
	const prevScrollTop = useRef(0);
	const isUserManuallyScrollingUp = useRef(false);

	const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
		const currentScrollTop = event.currentTarget.scrollTop;

		if (prevScrollTop.current > currentScrollTop) {
			isUserManuallyScrollingUp.current = true;
		} else {
			const currentScrollTop = event.currentTarget.scrollTop;
			const scrollHeight = event.currentTarget.scrollHeight;
			const clientHeight = event.currentTarget.clientHeight;

			if (currentScrollTop + clientHeight >= scrollHeight) {
				isUserManuallyScrollingUp.current = false;
			}
		}
		prevScrollTop.current = currentScrollTop;
	}, []);

	const scrollToBottom = (behavior: "instant" | "smooth") => {
		const scrollHeight = listRef.current?.scrollHeight ?? 0;
		listRef.current?.scrollTo({
			top: scrollHeight,
			behavior,
		});
	};

	useEffect(() => {
		// Scroll to bottom when chat changes
		scrollToBottom("instant");

		// Reset manual scrolling flag
		isUserManuallyScrollingUp.current = false;
	}, [props.store.chat.id]);

	useEffect(() => {
		scrollToBottom("smooth");

		// Reset manual scrolling flag
		isUserManuallyScrollingUp.current = false;
	}, [props.store.messages.length]);

	useEffect(() => {
		if (isUserManuallyScrollingUp.current === true) return;
		const scrollHeight = listRef.current?.scrollHeight ?? 0;
		listRef.current?.scrollTo({
			top: scrollHeight,
			behavior: "smooth",
		});
	}, [listRef.current?.scrollHeight, isUserManuallyScrollingUp]);

	return (
		<ScrollArea
			className={clsx("", props.className)}
			ref={listRef}
			onScroll={handleScroll}
		>
			{props.children}
		</ScrollArea>
	);
});

export default ListContainer;
