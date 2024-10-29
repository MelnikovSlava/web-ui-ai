"use client";
import type React from "react";
import CheckWorkspaceExist from "./CheckWorkspaceExist";

export default function WorkspacePage(props: { children: React.ReactNode }) {
	return <CheckWorkspaceExist>{props.children}</CheckWorkspaceExist>;
}
