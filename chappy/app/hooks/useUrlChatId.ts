import { useParams } from "next/navigation";

export const useUrlChatId = () => {
	const params = useParams<{ chatId: string }>();
	const urlChatId = Number(params.chatId);

	return urlChatId;
};
