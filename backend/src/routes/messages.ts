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
	timestamp: number;
}

interface UpdateMessagePayload {
	newContent: string;
}

const messageRoutes = (server: Server) => {
	// Route to add a message
	server.route({
		method: "POST",
		path: "/api/messages",
		options: {
			validate: {
				payload: Joi.object({
					chatId: Joi.number().required(),
					content: Joi.string().required(),
					role: Joi.string().valid("user", "assistant").required(),
					timestamp: Joi.number().required(),
				}),
			},
		},
		handler: async (request, h) => {
			const { chatId, content, role, timestamp } =
				request.payload as AddMessagePayload;
			await addMessage(chatId, content, role, timestamp);
			return h.response().code(201);
		},
	});

	// Route to delete a message
	server.route({
		method: "DELETE",
		path: "/api/messages/{id}",
		options: {
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

	// Route to update a message's content
	server.route({
		method: "PUT",
		path: "/api/messages/{id}",
		options: {
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
