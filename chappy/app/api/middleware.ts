import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "../utils/jwt";

type AuthResult = {
	isAuthorized: boolean;
	userId?: number;
	response?: NextResponse;
};

export async function checkAuth(needsUserId = false): Promise<AuthResult> {
	try {
		const headersList = await headers();
		const authorization = headersList.get("authorization");

		if (!authorization) {
			return {
				isAuthorized: false,
				response: NextResponse.json(
					{ message: "No token provided" },
					{ status: 401 },
				),
			};
		}

		if (needsUserId) {
			const token = authorization.replace("Bearer ", "");
			const decoded = await verifyToken(token);
			return {
				isAuthorized: true,
				userId: decoded.id,
			};
		}

		return {
			isAuthorized: true,
		};
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return {
			isAuthorized: false,
			response: NextResponse.json({ message }, { status: 401 }),
		};
	}
}
