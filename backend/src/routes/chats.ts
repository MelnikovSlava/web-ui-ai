import type { Server } from "@hapi/hapi";
import Joi from "joi";
import {
	addChat,
	deleteChat,
	forkChat,
	updateChatName,
} from "../services/chat.service";

interface AddChatPayload {
	name: string;
	workspaceId: number;
}

interface UpdateChatPayload {
	newName: string;
}

interface ForkChatPayload {
	messageId: number;
}

const chatRoutes = (server: Server) => {
	server.route({
		method: "POST",
		path: "/api/chats/add",
		options: {
			auth: "jwt",
			validate: {
				payload: Joi.object({
					name: Joi.string().allow("").required(),
					workspaceId: Joi.number().required(),
				}),
			},
		},
		handler: async (request, h) => {
			const { name, workspaceId } = request.payload as AddChatPayload;
			const result = await addChat(workspaceId, name);

			return h.response(result).code(201);
		},
	});

	server.route({
		method: "DELETE",
		path: "/api/chats/{id}/delete",
		options: {
			auth: "jwt",
			validate: {
				params: Joi.object({
					id: Joi.number().required(),
				}),
			},
		},
		handler: async (request, h) => {
			const { id } = request.params;
			await deleteChat(id);
			return h.response().code(204);
		},
	});

	server.route({
		method: "PUT",
		path: "/api/chats/{id}/update",
		options: {
			auth: "jwt",
			validate: {
				params: Joi.object({
					id: Joi.number().required(),
				}),
				payload: Joi.object({
					newName: Joi.string().required(),
				}),
			},
		},
		handler: async (request, h) => {
			const { id } = request.params;
			const { newName } = request.payload as UpdateChatPayload;
			await updateChatName(id, newName);
			return h.response().code(200);
		},
	});

	server.route({
		method: "POST",
		path: "/api/chats/{id}/fork",
		options: {
			auth: "jwt",
			validate: {
				params: Joi.object({
					id: Joi.number().required(),
				}),
				payload: Joi.object({
					messageId: Joi.number().required(),
				}),
			},
		},
		handler: async (request, h) => {
			const { id } = request.params;
			const { messageId } = request.payload as ForkChatPayload;
			const result = await forkChat(id, messageId);

			return h.response(result).code(201);
		},
	});
};

export default chatRoutes;
