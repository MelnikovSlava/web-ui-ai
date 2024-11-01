import { useHotkeys } from "react-hotkeys-hook";
import { HOTKEYS } from "../../utils/hotkeys";
import { useCreateChat } from "../useCreateChat";

export function useCreateChatHotkey() {
	const { onCreateChat } = useCreateChat();

	useHotkeys(HOTKEYS.createNewChat, onCreateChat.promise, {
		enableOnFormTags: true,
	});
}
