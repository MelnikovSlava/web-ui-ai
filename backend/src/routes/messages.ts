import type { Server } from "@hapi/hapi";
import Joi from "joi";
import {
	addMessage,
	deleteMessage,
	updateMessageContent,
} from "../services/message.service";

interface AddMessagePayload {
	chatId: number;
	content: string;
	role: string;
}

interface UpdateMessagePayload {
	newContent: string;
}

interface DeleteMessagesPayload {
	ids: number[];
}

const messageRoutes = (server: Server) => {
	// Route to add a message
	server.route({
		method: "POST",
		path: "/api/messages/add",
		options: {
			auth: "jwt",
			validate: {
				payload: Joi.object({
					chatId: Joi.number().required(),
					content: Joi.string().required(),
					role: Joi.string().valid("user", "assistant").required(),
				}),
			},
		},
		handler: async (request, h) => {
			const { chatId, content, role } = request.payload as AddMessagePayload;
			const msg = await addMessage(chatId, content, role);

			return h.response(msg).code(201);
		},
	});

	// Route to delete a message
	server.route({
		method: "DELETE",
		path: "/api/messages/{id}/delete",
		options: {
			auth: "jwt",
			validate: {
				params: Joi.object({
					id: Joi.number().required(), // Ensure id is a number
				}),
			},
		},
		handler: async (request, h) => {
			const { id } = request.params;
			await deleteMessage(id);
			return h.response().code(204);
		},
	});

	// Route to delete multiple messages
	server.route({
		method: "DELETE",
		path: "/api/messages/delete",
		options: {
			auth: "jwt",
			validate: {
				payload: Joi.object({
					ids: Joi.array().items(Joi.number().required()).required(),
				}),
			},
		},
		handler: async (request, h) => {
			const { ids } = request.payload as DeleteMessagesPayload;
			await Promise.all(ids.map((id) => deleteMessage(id)));
			return h.response().code(204);
		},
	});

	// Route to update a message's content
	server.route({
		method: "PUT",
		path: "/api/messages/{id}/update",
		options: {
			auth: "jwt",
			validate: {
				params: Joi.object({
					id: Joi.number().required(), // Ensure id is a number
				}),
				payload: Joi.object({
					newContent: Joi.string().required(),
				}),
			},
		},
		handler: async (request, h) => {
			const { id } = request.params;
			const { newContent } = request.payload as UpdateMessagePayload;
			await updateMessageContent(id, newContent);
			return h.response().code(200);
		},
	});
};

export default messageRoutes;
