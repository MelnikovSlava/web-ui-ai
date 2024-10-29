import { NextResponse } from "next/server";
import { z } from "zod";
import { createChat } from "../../lib/chat";
import { checkAuth } from "../middleware";

const createChatSchema = z.object({
	name: z.string(),
	workspaceId: z.number(),
});

export async function POST(request: Request) {
	try {
		const auth = await checkAuth();
		if (!auth.isAuthorized) {
			return auth.response;
		}

		const body = await request.json();
		const { name, workspaceId } = createChatSchema.parse(body);

		const chat = await createChat(name, workspaceId);
		return NextResponse.json(chat);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ message }, { status: 400 });
	}
}
