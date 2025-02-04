import type { Plugin, Server } from "@hapi/hapi";
import { eq } from "drizzle-orm";
import { envVariables } from "../config";
import { db } from "../config/database";
import { usersTable } from "../db/schema";

export const authPlugin: Plugin<null> = {
	name: "auth",
	register: async (server: Server) => {
		server.auth.strategy("jwt", "jwt", {
			keys: envVariables.jwtSecret,
			verify: {
				aud: false,
				iss: false,
				sub: false,
				nbf: true,
				exp: true,
				maxAgeSec: 31536000, // Updated to 1 year
				timeSkewSec: 15,
			},
			validate: async (artifacts: any, request: any, h: any) => {
				const user = await db
					.select()
					.from(usersTable)
					.where(eq(usersTable.id, artifacts.decoded.payload.id))
					.get();

				if (!user) {
					return { isValid: false };
				}

				return { isValid: true, credentials: user };
			},
		});

		server.auth.default("jwt");
	},
};
