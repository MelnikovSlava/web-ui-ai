import { eq } from "drizzle-orm";
import { db } from "../config/database";
import { modelsTable } from "../db/schema";

export const addModel = async (name: string) => {
  return await db
    .insert(modelsTable)
    .values({ name })
    .returning()
    .get();
};

export const deleteModel = async (id: number) => {
  return await db
    .delete(modelsTable)
    .where(eq(modelsTable.id, id));
};

export const getAllModels = async () => {
  return await db
    .select()
    .from(modelsTable);
};
