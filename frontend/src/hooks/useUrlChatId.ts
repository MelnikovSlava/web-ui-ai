import { useParams } from "react-router";

export const useUrlChatId = () => {
	const params = useParams();
	const urlChatId = Number(params?.chatId);

	return urlChatId;
};
