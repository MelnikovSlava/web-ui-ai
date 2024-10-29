import { messagesTable } from "@/db/schema";
import type { Message } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db/db";

export async function getAllMessages(chatId: number): Promise<Message[]> {
	return await db
		.select()
		.from(messagesTable)
		.where(eq(messagesTable.chatId, chatId));
}

export async function addMessage(
	content: string,
	chatId: number,
	role: string,
): Promise<Message> {
	const message = await db
		.insert(messagesTable)
		.values({ chatId, content, role, timestamp: Date.now() })
		.returning()
		.get();

	return message;
}

export async function deleteMessage(id: number): Promise<void> {
	await db.delete(messagesTable).where(eq(messagesTable.id, id));
}

export async function updateMessageContent(id: number, content: string) {
	await db
		.update(messagesTable)
		.set({ content })
		.where(eq(messagesTable.id, id));
}
