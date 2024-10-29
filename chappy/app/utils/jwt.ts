import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function signToken(payload: any): Promise<string> {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
			if (err) reject(err);
			else resolve(token as string);
		});
	});
}

export function verifyToken(token: string): Promise<any> {
	return new Promise((resolve, reject) => {
		jwt.verify(token, JWT_SECRET, (err, decoded) => {
			if (err) reject(err);
			else resolve(decoded as any);
		});
	});
}
