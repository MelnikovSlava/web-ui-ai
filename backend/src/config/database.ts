import { drizzle } from "drizzle-orm/libsql";
import { envVariables } from "../config";

export const db = drizzle({
	connection: {
		// url: "file:d.sqlite",
		url: envVariables.dbFileName,
	},
});
