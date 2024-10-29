import { NextResponse } from "next/server";
import { z } from "zod";
import { forkChat } from "../../../../lib/chat";
import { checkAuth } from "../../../middleware";

const forkChatSchema = z.object({
	messageId: z.number(),
});

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ chatId: string }> },
) {
	try {
		const auth = await checkAuth();
		if (!auth.isAuthorized) {
			return auth.response;
		}

		const chatId = (await params).chatId;
		const body = await request.json();
		const { messageId } = forkChatSchema.parse(body);

		const result = await forkChat(Number(chatId), messageId);

		return NextResponse.json(result);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ message }, { status: 400 });
	}
}
