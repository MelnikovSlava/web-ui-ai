import { NextResponse } from "next/server";
import { deleteWorkspace } from "../../../lib/workspace";
import { checkAuth } from "../../middleware";

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ workspaceId: string }> },
) {
	try {
		const auth = await checkAuth();
		if (!auth.isAuthorized) {
			return auth.response;
		}

		const id = (await params).workspaceId;

		if (!id) {
			return NextResponse.json(
				{ message: "Workspace ID is required" },
				{ status: 400 },
			);
		}

		await deleteWorkspace(Number.parseInt(id));
		return NextResponse.json({ success: true });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ message }, { status: 500 });
	}
}
