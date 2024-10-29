import { chatsTable } from "@/db/schema";
import type { Chat, Message } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { addMessage, getAllMessages } from "./message";

export async function getAllChats(workspaceId: number): Promise<Chat[]> {
	return await db
		.select()
		.from(chatsTable)
		.where(eq(chatsTable.workspaceId, workspaceId));
}

export async function createChat(
	name: string,
	workspaceId: number,
): Promise<Chat> {
	const chat = await db
		.insert(chatsTable)
		.values({ name, timestamp: Date.now(), workspaceId })
		.returning()
		.get();

	return chat;
}

export async function deleteChat(id: number): Promise<void> {
	await db.delete(chatsTable).where(eq(chatsTable.id, id));
}

export const addChat = async (workspaceId: number, name: string) => {
	return await db
		.insert(chatsTable)
		.values({ name, timestamp: Date.now(), workspaceId })
		.returning()
		.get();
};

export const updateChatName = async (id: number, newName: string) => {
	return await db
		.update(chatsTable)
		.set({ name: newName })
		.where(eq(chatsTable.id, id));
};

export const getChat = async (id: number) => {
	const chats = await db.select().from(chatsTable).where(eq(chatsTable.id, id));
	return chats[0];
};

export const forkChat = async (chatId: number, messageId: number) => {
	const donorChat = await getChat(chatId);
	const newChat = await addChat(donorChat.workspaceId, "");

	const messages = await getAllMessages(chatId);
	const msgsForCopy = messages.filter((msg) => msg.id <= messageId);

	const msgs: Message[] = [];

	for await (const msg of msgsForCopy) {
		const addedMsg = await addMessage(msg.content, newChat.id, msg.role);

		msgs.push(addedMsg);
	}

	return { chat: newChat, messages: msgs };
};
