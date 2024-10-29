import { workspacesTable } from "@/db/schema";
import type { Workspace } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db/db";

export async function getAllWorkspaces(userId: number): Promise<Workspace[]> {
	return await db
		.select()
		.from(workspacesTable)
		.where(eq(workspacesTable.userId, userId));
}

export async function createWorkspace(
	name: string,
	model: string,
	userId: number,
): Promise<Workspace> {
	const workspace = await db
		.insert(workspacesTable)
		.values({ name, model, userId })
		.returning()
		.get();

	return workspace;
}

export async function deleteWorkspace(id: number): Promise<void> {
	await db.delete(workspacesTable).where(eq(workspacesTable.id, id));
}

export async function updateWorkspace(
	id: number,
	newName: string,
	newModel: string,
) {
	await db
		.update(workspacesTable)
		.set({ name: newName, model: newModel })
		.where(eq(workspacesTable.id, id));
}
