import { NextResponse } from "next/server";
import { z } from "zod";
import { addMessage, deleteMessage } from "../../lib/message";
import { checkAuth } from "../middleware";

const createMessageSchema = z.object({
	content: z.string(),
	chatId: z.number(),
	role: z.string(),
});

export async function POST(request: Request) {
	try {
		const auth = await checkAuth();
		if (!auth.isAuthorized) {
			return auth.response;
		}

		const body = await request.json();
		const { content, chatId, role } = createMessageSchema.parse(body);

		const message = await addMessage(content, chatId, role);
		return NextResponse.json(message);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ message }, { status: 400 });
	}
}

export async function DELETE(request: Request) {
	try {
		const auth = await checkAuth();
		if (!auth.isAuthorized) {
			return auth.response;
		}

		const body = await request.json();
		const ids = body.ids;

		if (!ids || !Array.isArray(ids) || ids.length === 0) {
			return NextResponse.json(
				{ message: "Message IDs are required" },
				{ status: 400 },
			);
		}

		for await (const id of ids) {
			await deleteMessage(Number.parseInt(id));
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ message }, { status: 500 });
	}
}
