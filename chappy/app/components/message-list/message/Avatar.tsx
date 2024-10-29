"use client";

import clsx from "clsx";
import Image from "next/image";
import { PiUserCircleFill } from "react-icons/pi";
import type { VitalProps } from "../../../utils/types";

type AvatarProps = {
	isUser: boolean;
} & VitalProps;

const SIZE = 24;

export const Avatar = (props: AvatarProps) => {
	return (
		<div className={clsx("", props.className)}>
			{props.isUser ? (
				<span className={clsx("flex items-end")}>
					<span style={{ fontSize: SIZE }} className={clsx("mr-2")}>
						<PiUserCircleFill className={clsx("opacity-50")} />
					</span>
					<span className={clsx("opacity-50")}>You</span>
				</span>
			) : (
				<span className={clsx("flex items-end")}>
					<Image
						src="/icon.png"
						alt="Robot"
						width={SIZE}
						height={SIZE}
						className={clsx("mr-2")}
					/>
					<span className={clsx("opacity-50")}>Assistent</span>
				</span>
			)}
		</div>
	);
};
