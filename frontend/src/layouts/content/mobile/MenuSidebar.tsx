import { IconButton } from "@mui/material";
import { Menu } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Fragment, useEffect, useState } from "react";
import { useUrlChatId } from "../../../hooks/useUrlChatId";
import type { VitalProps } from "../../../utils/types";
import { DrawerMobile } from "./DrawerMobile";

type MenuSidebarProps = {} & VitalProps;

export const MenuSidebar = observer((props: MenuSidebarProps) => {
	const [open, setOpen] = useState(false);
	const chatId = useUrlChatId();

	useEffect(() => {
		if (open) {
			setOpen(false);
		}
	}, [chatId]);

	const toggleDrawer = () => {
		setOpen(!open);
	};

	return (
		<Fragment>
			<DrawerMobile onClose={toggleDrawer} open={open} />
			<IconButton onClick={() => toggleDrawer()}>
				<Menu />
			</IconButton>
		</Fragment>
	);
});
