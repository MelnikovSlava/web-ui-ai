import type { Server } from "@hapi/hapi";
import Joi from "joi";
import type { Chat, Message, Model } from "../db/schema";
import { getAllChats } from "../services/chat.service";
import { getAllMessages } from "../services/message.service";
import { authenticateUser, getUserTitleModel, registerUser, updateUserTitleModel } from "../services/user.service";
import { getAllWorkspaces } from "../services/workspace.service";
import { getAllModels } from "../services/model.service";

export const authRoutes = (server: Server) => {
	server.route({
		method: "POST",
		path: "/api/register",
		options: {
			auth: false,
			validate: {
				payload: Joi.object({
					username: Joi.string().required(),
					password: Joi.string().required(),
				}),
			},
		},
		handler: async (request, h) => {
			const { username, password } = request.payload as {
				username: string;
				password: string;
			};

			try {
				const token = await registerUser(username, password);
				return { token };
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "An unknown error occurred";
				return h.response({ message }).code(400);
			}
		},
	});

	server.route({
		method: "POST",
		path: "/api/login",
		options: {
			auth: false,
			validate: {
				payload: Joi.object({
					username: Joi.string().required(),
					password: Joi.string().required(),
				}),
			},
		},
		handler: async (request, h) => {
			const { username, password } = request.payload as {
				username: string;
				password: string;
			};

			try {
				const token = await authenticateUser(username, password);
				return { token };
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "An unknown error occurred";
				return h.response({ message }).code(401);
			}
		},
	});

	server.route({
		method: "GET",
		path: "/api/data",
		options: {
			auth: "jwt",
		},
		handler: async (request, h) => {
			const userId = Number(request.auth.credentials.id);

			try {
				const workspaces = await getAllWorkspaces(userId);
				const models = await getAllModels();
				const titleModel = await getUserTitleModel(userId);

				const allChats: Chat[] = [];
				const allMessages: Message[] = [];

				for (const workspace of workspaces) {
					const chats = await getAllChats(workspace.id);
					allChats.push(...chats);

					for (const chat of chats) {
						const messages = await getAllMessages(chat.id);
						allMessages.push(...messages);
					}
				}

				return h
					.response({
						workspaces,
						chats: allChats,
						messages: allMessages,
						models,
						titleModel,
					})
					.code(200);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "An unknown error occurred";
				return h.response({ message }).code(500);
			}
		},
	});

	server.route({
		method: "PUT",
		path: "/api/user/update-title-model",
		options: {
			auth: "jwt",
			validate: {
				payload: Joi.object({
					titleModel: Joi.string().allow("").required(),
				}),
			},
		},
		handler: async (request, h) => {
			const userId = Number(request.auth.credentials.id);
			const { titleModel } = request.payload as { titleModel: string };

			try {
				await updateUserTitleModel(userId, titleModel);
				return h.response().code(200);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "An unknown error occurred";
				return h.response({ message }).code(500);
			}
		},
	});
};
