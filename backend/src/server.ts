import Hapi from "@hapi/hapi";
import { authPlugin } from "./plugins/auth";
import { authRoutes } from "./routes/auth";
import workspaceRoutes from "./routes/workspace"; // Import the workspace routes
import { config } from "./config";
import messageRoutes from "./routes/messages";
import chatRoutes from "./routes/chats";

const init = async () => {
	const server = Hapi.server({
		port: config.port,
		host: "localhost",
		routes: {
			cors: true,
		},
	});

	await server.register([require("@hapi/jwt"), authPlugin]);

	authRoutes(server);
	workspaceRoutes(server);
	messageRoutes(server);
	chatRoutes(server);

	await server.start();
	console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
	console.log(err);
	process.exit(1);
});

init();
