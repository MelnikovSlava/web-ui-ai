"use client";

import { redirect } from "next/navigation";
import { routes } from "./routers";

export default function Home() {
		redirect(routes.home);
	}
