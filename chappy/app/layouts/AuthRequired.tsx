"use client";

import { useRouter } from "next/navigation";
import { useJwtToken } from "../hooks/useJwtToken";
import { routes } from "../routers";

interface AuthRequiredProps {
	children: React.ReactNode;
}

export const AuthRequired = ({ children }: AuthRequiredProps) => {
	const token = useJwtToken();
	const router = useRouter();

	if (!token) {
		router.push(routes.auth);
	}

	return children;
};
