import Hapi from "@hapi/hapi";
import { envVariables } from "./config";
import { authPlugin } from "./plugins/auth";
import { authRoutes } from "./routes/auth";
import chatRoutes from "./routes/chats";
import messageRoutes from "./routes/messages";
import workspaceRoutes from "./routes/workspace";
import modelRoutes from "./routes/models";

const init = async () => {
	const server = Hapi.server({
		port: envVariables.port,
		host: envVariables.nodeEnv === "production" ? "0.0.0.0" : "localhost",
		routes: {
			cors: true,
		},
	});

	await server.register([require("@hapi/jwt"), authPlugin]);

	authRoutes(server);
	workspaceRoutes(server);
	messageRoutes(server);
	chatRoutes(server);
	modelRoutes(server);

	await server.start();
	console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
	console.log(err);
	process.exit(1);
});

init();
