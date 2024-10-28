import clsx from "clsx";
import type React from "react";
import type { FC } from "react";
import type { VitalProps } from "../utils/types";

type AccordionProps = {
	title: React.ReactNode;
	children: React.ReactNode;
	isOpen: boolean;
	onToggle: () => void;
} & VitalProps;

export const Accordion: FC<AccordionProps> = (props) => {
	const { title, children, isOpen, onToggle, className } = props;

	return (
		<div className={clsx("accordion", className)}>
			<div
				className={clsx("accordion-header", {
					"accordion-header-open": isOpen,
				})}
				onClick={onToggle}
			>
				{title}
			</div>
			{isOpen && <div className="accordion-content">{children}</div>}
		</div>
	);
};
