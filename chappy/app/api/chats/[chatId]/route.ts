import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteChat, updateChatName } from "../../../lib/chat";
import { checkAuth } from "../../middleware";

const updateChatSchema = z.object({
	newName: z.string(),
});

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ chatId: string }> },
) {
	try {
		const auth = await checkAuth();
		if (!auth.isAuthorized) {
			return auth.response;
		}

		const id = (await params).chatId;

		if (!id) {
			return NextResponse.json(
				{ message: "Chat ID is required" },
				{ status: 400 },
			);
		}

		await deleteChat(Number.parseInt(id));
		return NextResponse.json({ success: true });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ message }, { status: 500 });
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ chatId: string }> },
) {
	try {
		const auth = await checkAuth();
		if (!auth.isAuthorized) {
			return auth.response;
		}

		const id = (await params).chatId;

		if (!id) {
			return NextResponse.json(
				{ message: "Chat ID is required" },
				{ status: 400 },
			);
		}

		const body = await request.json();
		const { newName } = updateChatSchema.parse(body);

		await updateChatName(Number.parseInt(id), newName);
		return NextResponse.json({ success: true });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ message }, { status: 500 });
	}
}
