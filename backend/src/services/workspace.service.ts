import { eq } from "drizzle-orm";
import { db } from "../config/database";
import { workspacesTable } from "../db/schema";

export const getAllWorkspaces = async (userId: number) => {
	return await db
		.select()
		.from(workspacesTable)
		.where(eq(workspacesTable.userId, userId));
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

export const createWorkspace = async (
	name: string,
	model: string,
	userId: number,
) => {
	const newWorkspace = { name, model, userId };
	const result = await db
		.insert(workspacesTable)
		.values(newWorkspace)
		.returning();
	return result[0];
};
