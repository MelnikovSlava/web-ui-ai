import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.string().default("4000").transform(Number),
	DB_FILE_NAME: z.string().default("file:database/db.sqlite"),
	JWT_SECRET: z.string(),
});

const envParseResult = envSchema.safeParse(process.env);

if (!envParseResult.success) {
	throw new Error(
		`Config validation error: ${envParseResult.error.toString()}`,
	);
}

export const envVariables = {
	env: envParseResult.data.NODE_ENV,
	port: envParseResult.data.PORT,
	dbFileName: envParseResult.data.DB_FILE_NAME,
	jwtSecret: envParseResult.data.JWT_SECRET,
};

export type EnvVariables = typeof envVariables;
