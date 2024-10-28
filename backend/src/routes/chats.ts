import type { Server } from "@hapi/hapi";
import Joi from "joi";
import { addChat, deleteChat, updateChatName } from "../services/chat.service";

interface AddChatPayload {
	name: string;
	workspaceId: number; // Adding workspaceId to the payload
}

interface UpdateChatPayload {
	newName: string;
}

const chatRoutes = (server: Server) => {
	server.route({
		method: "POST",
		path: "/api/chats",
		options: {
			validate: {
				payload: Joi.object({
					name: Joi.string().required(),
					workspaceId: Joi.number().required(), // Validating workspaceId
				}),
			},
		},
		handler: async (request, h) => {
			const { name, workspaceId } = request.payload as AddChatPayload;
			const result = await addChat(workspaceId, name);

			return h.response(result[0]).code(201);
		},
	});

	server.route({
		method: "DELETE",
		path: "/api/chats/{id}",
		options: {
			validate: {
				params: Joi.object({
					id: Joi.number().required(), // Ensure id is a number
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
		path: "/api/chats/{id}",
		options: {
			validate: {
				params: Joi.object({
					id: Joi.number().required(), // Ensure id is a number
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
};

export default chatRoutes;
