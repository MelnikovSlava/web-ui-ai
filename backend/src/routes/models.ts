import type { Server } from "@hapi/hapi";
import Joi from "joi";
import { addModel, deleteModel, getAllModels } from "../services/model.service";

interface AddModelPayload {
  name: string;
}

const modelRoutes = (server: Server) => {
  server.route({
    method: "POST",
    path: "/api/models/add",
    options: {
      auth: "jwt",
      validate: {
        payload: Joi.object({
          name: Joi.string().required(),
        }),
      },
    },
    handler: async (request, h) => {
      const { name } = request.payload as AddModelPayload;
      const result = await addModel(name);
      return h.response(result).code(201);
    },
  });

  server.route({
    method: "DELETE",
    path: "/api/models/{id}/delete",
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
      await deleteModel(id);
      return h.response().code(204);
    },
  });

  server.route({
    method: "GET",
    path: "/api/models",
    options: {
      auth: "jwt",
    },
    handler: async (request, h) => {
      const models = await getAllModels();
      return h.response(models).code(200);
    },
  });
};

export default modelRoutes;
