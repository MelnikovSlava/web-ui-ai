import jwt from "jsonwebtoken";
import { envVariables } from "../config";

export const generateToken = (userId: number): string => {
	return jwt.sign({ id: userId }, envVariables.jwtSecret, {
		expiresIn: "30d",
	});
};
