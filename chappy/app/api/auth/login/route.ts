import { authenticateUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
	username: z.string().min(3),
	password: z.string().min(6),
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { username, password } = loginSchema.parse(body);

		const token = await authenticateUser(username, password);
		return NextResponse.json({ token });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.json({ message }, { status: 401 });
	}
}
