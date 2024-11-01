import type { Request, ResponseToolkit } from "@hapi/hapi";
import Joi from "joi";
import {
	createWorkspace,
	deleteWorkspace,
	updateWorkspace,
} from "../services/workspace.service";

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
		path: "/api/workspace/add",
		options: {
			auth: "jwt",
			validate: {
				payload: Joi.object({
					name: Joi.string().allow("").required(),
					model: Joi.string().allow("").required(),
				}),
			},
		},
		handler: async (request, h) => {
			const { name, model } = request.payload as CreateWorkspacePayload;
			const userId = request.auth.credentials.id;

			try {
				const workspace = await createWorkspace(name, model, userId);
				return h.response(workspace).code(201);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "An unknown error occurred";
				return h.response({ message }).code(400);
			}
		},
	});

	server.route({
		method: "DELETE",
		path: "/api/workspace/{id}/delete",
		options: {
			auth: "jwt",
			validate: {
				params: Joi.object({
					id: Joi.number().required(),
				}),
			},
		},
		handler: async (request: Request, h: ResponseToolkit) => {
			const { id } = request.params;
			await deleteWorkspace(id);
			return h.response().code(204);
		},
	});

	server.route({
		method: "PUT",
		path: "/api/workspace/update",
		options: {
			auth: "jwt",
			validate: {
				payload: Joi.object({
					id: Joi.number().required(),
					newName: Joi.string().allow("").required(),
					newModel: Joi.string().allow("").required(),
				}),
			},
		},
		handler: async (request: Request, h: ResponseToolkit) => {
			const { id, newName, newModel } =
				request.payload as UpdateWorkspacePayload;
			await updateWorkspace(id, newName, newModel);
			return h.response().code(200);
		},
	});
};

export default workspaceRoutes;
