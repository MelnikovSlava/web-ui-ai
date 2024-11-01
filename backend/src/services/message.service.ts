import { eq } from "drizzle-orm";
import { db } from "../config/database";
import { messagesTable } from "../db/schema";

export const addMessage = async (
	chatId: number,
	content: string,
	role: string,
) => {
	return await db
		.insert(messagesTable)
		.values({ chatId, content, role, timestamp: Date.now() })
		.returning()
		.get();
};

export const deleteMessage = async (id: number) => {
	await db.delete(messagesTable).where(eq(messagesTable.id, id));
};

export const updateMessageContent = async (id: number, newContent: string) => {
	await db
		.update(messagesTable)
		.set({
			content: newContent,
		})
		.where(eq(messagesTable.id, id));
};

export const getAllMessages = async (chatId: number) => {
	return await db
		.select()
		.from(messagesTable)
		.where(eq(messagesTable.chatId, chatId));
};
