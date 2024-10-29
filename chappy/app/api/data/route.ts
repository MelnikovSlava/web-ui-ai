import { NextResponse } from "next/server";
import { getAllChats } from "../../lib/chat";
import { getAllMessages } from "../../lib/message";
import { getAllWorkspaces } from "../../lib/workspace";
import { checkAuth } from "../middleware";

export async function GET() {
	try {
		const auth = await checkAuth(true);
		if (!auth.isAuthorized || !auth.userId) {
			return auth.response;
		}

		const workspaces = await getAllWorkspaces(auth.userId);
		const allChats = [];
		const allMessages = [];

		for (const workspace of workspaces) {
			const chats = await getAllChats(workspace.id);
			allChats.push(...chats);

			for (const chat of chats) {
				const messages = await getAllMessages(chat.id);
				allMessages.push(...messages);
			}
		}

		return NextResponse.json({
			workspaces,
			chats: allChats,
			messages: allMessages,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ message }, { status: 500 });
	}
}
