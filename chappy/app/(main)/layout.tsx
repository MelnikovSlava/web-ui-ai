"use client";

import { AuthRequired } from "@/layouts/AuthRequired";
import { App } from "../layouts/App";
import { Content } from "../layouts/Content";

type MainLayoutProps = {
	children: React.ReactNode;
};

export default function MainLayout(props: MainLayoutProps) {
	return (
		<AuthRequired>
			<App>
				<Content>{props.children}</Content>
			</App>
		</AuthRequired>
	);
}
