import { eq } from "drizzle-orm";
import { db } from "../config/database";
import { chatsTable } from "../db/schema";

export const addChat = async (workspaceId: number, name: string) => {
	return await db
		.insert(chatsTable)
		.values({ name, timestamp: Date.now(), workspaceId })
		.returning();
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

// New function to retrieve all chats
export const getAllChats = async () => {
	return await db.select().from(chatsTable);
};
