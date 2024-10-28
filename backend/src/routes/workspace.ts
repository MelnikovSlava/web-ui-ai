import Joi from "joi";
import {
	deleteWorkspace,
	updateWorkspace,
	getAllWorkspaces,
	createWorkspace,
} from "../services/workspace.service";
import { getAllChats } from "../services/chat.service";
import { getAllMessages } from "../services/message.service";

interface CreateWorkspacePayload {
	name: string;
	model: string;
}

interface UpdateWorkspacePayload {
	id: number;
	newName: string;
	newModel: string;
}

const workspaceRoutes = (server) => {
	server.route({
		method: "POST",
		path: "/api/workspace",
		options: {
			auth: false,
			validate: {
				payload: Joi.object({
					name: Joi.string().required(),
					model: Joi.string().required(),
				}),
			},
		},
		handler: async (request, h) => {
			const { name, model } = request.payload as CreateWorkspacePayload;

			try {
				const workspaceId = await createWorkspace(name, model);
				return h.response({ id: workspaceId, name, model }).code(201);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "An unknown error occurred";
				return h.response({ message }).code(400);
			}
		},
	});

	server.route({
		method: "DELETE",
		path: "/api/workspace/{id}",
		options: {
			validate: {
				params: Joi.object({
					id: Joi.number().required(),
				}),
			},
		},
		handler: async (request, h) => {
			const { id } = request.params;
			await deleteWorkspace(id);
			return h.response().code(204);
		},
	});

	server.route({
		method: "PUT",
		path: "/api/workspace",
		options: {
			validate: {
				payload: Joi.object({
					id: Joi.number().required(),
					newName: Joi.string().required(),
					newModel: Joi.string().required(),
				}),
			},
		},
		handler: async (request, h) => {
			const { id, newName, newModel } =
				request.payload as UpdateWorkspacePayload;
			await updateWorkspace(id, newName, newModel);
			return h.response().code(200);
		},
	});

	server.route({
		method: "GET",
		path: "/api/data",
		handler: async (request, h) => {
			const workspaces = await getAllWorkspaces();
			const chats = await getAllChats();
			const messages = await getAllMessages();

			return h
				.response({
					workspaces,
					chats,
					messages,
				})
				.code(200);
		},
	});
};

export default workspaceRoutes;
