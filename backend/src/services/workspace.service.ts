import { db } from "../config/database";
import { workspacesTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const getAllWorkspaces = async () => {
	return await db.select().from(workspacesTable);
};

export const deleteWorkspace = async (id: number) => {
	await db.delete(workspacesTable).where(eq(workspacesTable.id, id));
};

export const updateWorkspace = async (
	id: number,
	newName: string,
	newModel: string,
) => {
	await db
		.update(workspacesTable)
		.set({ name: newName, model: newModel })
		.where(eq(workspacesTable.id, id));
};

export const createWorkspace = async (name: string, model: string) => {
	const newWorkspace = { name, model };
	const result = (await db.insert(workspacesTable).values(newWorkspace)) as any;
	return result?.lastInsertRowid as number;
};
