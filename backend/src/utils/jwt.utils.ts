import jwt from "jsonwebtoken";
import { config } from "../config";

export const generateToken = (userId: number): string => {
	return jwt.sign({ id: userId }, config.jwtSecret, {
		expiresIn: "1000h",
	});
};
