import { NextResponse } from "next/server";
import { z } from "zod";
import { updateMessageContent } from "../../../lib/message";
import { checkAuth } from "../../middleware";

const updateMessageSchema = z.object({
	newContent: z.string(),
});

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ messageId: string }> },
) {
	try {
		const auth = await checkAuth();
		if (!auth.isAuthorized) {
			return auth.response;
		}

		const id = (await params).messageId;

		if (!id) {
			return NextResponse.json(
				{ message: "Message ID is required" },
				{ status: 400 },
			);
		}

		const body = await request.json();
		const { newContent } = updateMessageSchema.parse(body);

		await updateMessageContent(Number.parseInt(id), newContent);
		return NextResponse.json({ success: true });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ message }, { status: 500 });
	}
}
