import type { Server } from "@hapi/hapi";
import Joi from "joi";
import { registerUser, authenticateUser } from "../services/user.service";

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
};
