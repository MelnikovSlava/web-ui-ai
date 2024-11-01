import { eq } from "drizzle-orm";
import { db } from "../config/database";
import { type Message, chatsTable } from "../db/schema";
import { addMessage, getAllMessages } from "./message.service";

export const addChat = async (workspaceId: number, name: string) => {
	return await db
		.insert(chatsTable)
		.values({ name, timestamp: Date.now(), workspaceId })
		.returning()
		.get();
};

export const deleteChat = async (id: number) => {
	return await db.delete(chatsTable).where(eq(chatsTable.id, id));
};

export const updateChatName = async (id: number, newName: string) => {
	return await db
		.update(chatsTable)
		.set({ name: newName })
		.where(eq(chatsTable.id, id));
};

export const getAllChats = async (workspaceId: number) => {
	return await db
		.select()
		.from(chatsTable)
		.where(eq(chatsTable.workspaceId, workspaceId));
};

export const getChat = async (id: number) => {
	const chats = await db.select().from(chatsTable).where(eq(chatsTable.id, id));
	return chats[0];
};

export const forkChat = async (chatId: number, messageId: number) => {
	const donorChat = await getChat(chatId);
	const newChat = await addChat(donorChat.workspaceId, "");
	const newChatId = newChat.id;

	const messages = await getAllMessages(chatId);
	const msgsForCopy = messages.filter((msg) => msg.id <= messageId);

	const msgs: Message[] = [];

	for await (const msg of msgsForCopy) {
		const addedMsg = await addMessage(newChatId, msg.content, msg.role);

		msgs.push(addedMsg);
	}

	return { chat: newChat, messages: msgs };
};
