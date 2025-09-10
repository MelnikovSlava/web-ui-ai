import { eq } from "drizzle-orm";
import { db } from "../config/database";
import { modelsTable, chatsTable } from "../db/schema";

export const addModel = async (name: string) => {
  return await db
    .insert(modelsTable)
    .values({ name })
    .returning()
    .get();
};

export const deleteModel = async (id: number) => {
  return await db.transaction(async (tx) => {
    // First, set modelId to null for all chats referencing this model
    await tx
      .update(chatsTable)
      .set({ modelId: null })
      .where(eq(chatsTable.modelId, id));

    // Then delete the model
    const result = await tx
      .delete(modelsTable)
      .where(eq(modelsTable.id, id));

    return result;
  });
};

export const getAllModels = async () => {
  return await db
    .select()
    .from(modelsTable);
};
