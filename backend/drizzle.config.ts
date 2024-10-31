// import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { envVariables } from "./src/config";

export default defineConfig({
	out: "./database/drizzle",
	schema: "./src/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: envVariables.dbFileName,
		// url: process.env.DB_FILE_NAME!,
	},
});
