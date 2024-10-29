import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./drizzle",
	schema: "./app/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: "database/database.sqlite",
		// url: "./d.sqlite",
		// url: process.env.DB_FILE_NAME!,
	},
});
