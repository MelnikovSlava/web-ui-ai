import { db } from "../config/database";
import { type User, usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.utils"; // Importing the new function

export const getUserById = async (id: number): Promise<User | undefined> => {
	return await db.select().from(usersTable).where(eq(usersTable.id, id)).get();
};

export const registerUser = async (username: string, password: string) => {
	const existingUser = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.username, username))
		.get();

	if (existingUser) {
		throw new Error("Username already exists");
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	await db.insert(usersTable).values({ username, password: hashedPassword });

	return await authenticateUser(username, password);
};

export const authenticateUser = async (username: string, password: string) => {
	const user = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.username, username))
		.get();

	if (!user) {
		throw new Error("Invalid credentials");
	}

	const isValid = await bcrypt.compare(password, user.password);

	if (!isValid) {
		throw new Error("Invalid credentials");
	}

	const token = generateToken(user.id);
	return token;
};
