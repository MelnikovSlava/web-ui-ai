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

export const updateWorkspaceModel = async (id: number, newModel: string) => {
	await db
		.update(workspacesTable)
		.set({ model: newModel })
		.where(eq(workspacesTable.id, id));
};

export const updateWorkspaceName = async (id: number, newName: string) => {
	await db
		.update(workspacesTable)
		.set({ name: newName })
		.where(eq(workspacesTable.id, id));
};

export const createWorkspace = async (
	name: string,
	model: string,
	userId: number,
) => {
	return await db
		.insert(workspacesTable)
		.values({ name, model, userId })
		.returning()
		.get();
};
