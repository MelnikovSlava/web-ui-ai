import { db } from "@/db/db";
import { usersTable } from "@/db/schema";
import { signToken } from "@/utils/jwt";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function registerUser(
	username: string,
	password: string,
): Promise<string> {
	// const existingUser = await db.query.users.findFirst({
	// 	where: eq(users.username, username),
	// });

	const existingUser = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.username, username))
		.get();

	if (existingUser) {
		throw new Error("Username already exists");
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await db
		.insert(usersTable)
		.values({
			username,
			password: hashedPassword,
		})
		.returning()
		.get();

	const token = await signToken({ id: user.id, username: user.username });
	return token;
}

export async function authenticateUser(
	username: string,
	password: string,
): Promise<string> {
	const user = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.username, username))
		.get();

	if (!user) {
		throw new Error("Invalid username or password");
	}

	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		throw new Error("Invalid username or password");
	}

	const token = await signToken({ id: user.id, username: user.username });
	return token;
}
