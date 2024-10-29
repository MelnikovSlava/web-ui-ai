import { NextResponse } from "next/server";
import { z } from "zod";
import { createWorkspace, updateWorkspace } from "../../lib/workspace";
import { checkAuth } from "../middleware";

const createWorkspaceSchema = z.object({
	name: z.string(),
	model: z.string(),
});

const updateWorkspaceSchema = z.object({
	id: z.number(),
	newName: z.string(),
	newModel: z.string(),
});

export async function POST(request: Request) {
	try {
		const auth = await checkAuth(true);
		if (!auth.isAuthorized || !auth.userId) {
			return auth.response;
		}

		const body = await request.json();
		const { name, model } = createWorkspaceSchema.parse(body);

		const workspace = await createWorkspace(name, model, auth.userId);
		return NextResponse.json(workspace);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ message }, { status: 400 });
	}
}

export async function PUT(request: Request) {
	try {
		const auth = await checkAuth(true);
		if (!auth.isAuthorized || !auth.userId) {
			return auth.response;
		}

		const body = await request.json();
		const { id, newName, newModel } = updateWorkspaceSchema.parse(body);

		await updateWorkspace(id, newName, newModel);
		return NextResponse.json({}, { status: 200 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ message }, { status: 400 });
	}
}
