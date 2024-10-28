import { db } from '../config/database'; 
import { messagesTable } from '../db/schema'; 
import { eq } from 'drizzle-orm';

export const addMessage = async (chatId: number, content: string, role: string, timestamp: number) => {
    const newMessage = { chatId, content, role, timestamp };
    await db.insert(messagesTable).values(newMessage);
};

export const deleteMessage = async (id: number) => {
    await db.delete(messagesTable).where(eq(messagesTable.id, id));
};

export const updateMessageContent = async (id: number, newContent: string) => {
    await db.update(messagesTable).set({
        content: newContent
    }).where(eq(messagesTable.id, id));
};

// New function to retrieve all messages
export const getAllMessages = async () => {
    return await db.select().from(messagesTable);
};
