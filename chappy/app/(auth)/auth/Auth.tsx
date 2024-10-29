"use client";

import { Box, Card, Tab, Tabs } from "@mui/material";
import { observer } from "mobx-react-lite";
import type React from "react";
import { useState } from "react";
import { useCreateStore } from "../../hooks/useCreateStore";
import { Login } from "./Login";
import { Register } from "./Register";
import AuthStore, { AuthStoreData } from "./auth.store";

export const Auth = observer(() => {
	const authStore = useCreateStore(new AuthStore());
	const [activeTab, setActiveTab] = useState<string>("login");

	return (
		<div style={{ width: "400px", margin: "auto" }}>
			<Box maxWidth="400px">
				<Card>
					<Box display="flex" flexDirection="column" gap={2}>
						<Tabs
							value={activeTab}
							onChange={(event, newValue) => setActiveTab(newValue)}
							variant="fullWidth"
						>
							<Tab label="Login" value="login" />
							<Tab label="Register" value="register" />
						</Tabs>
						<Box pt={3}>
							<AuthStoreData.context.Provider value={authStore}>
								<TabPanel value="login" activeTab={activeTab}>
									<Login />
								</TabPanel>
								<TabPanel value="register" activeTab={activeTab}>
									<Register />
								</TabPanel>
							</AuthStoreData.context.Provider>
						</Box>
					</Box>
				</Card>
			</Box>
		</div>
	);
});

function TabPanel(props: {
	children: React.ReactNode;
	value: string;
	activeTab: string;
}) {
	const { children, value, activeTab, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={activeTab !== value}
			id={`tabpanel-${value}`}
			aria-labelledby={`tab-${value}`}
			{...other}
		>
			{activeTab === value && <Box p={3}>{children}</Box>}
		</div>
	);
}
