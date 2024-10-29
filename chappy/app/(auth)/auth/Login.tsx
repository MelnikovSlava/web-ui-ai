"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { usePromise } from "../../hooks/usePromise";
import { routes } from "../../routers";
import { AuthStoreData } from "./auth.store";
import { type AuthFormData, authSchema } from "./schema";

export const Login = () => {
	const router = useRouter();
	const authStore = AuthStoreData.hook();

	const form = useForm<AuthFormData>({
		resolver: zodResolver(authSchema),
	});

	const loginPromise = usePromise({
		func: authStore.loginAction,
		resolve: () => {
			router.replace(routes.home);
		},
		showError: false,
		reject: (error: any, func) => {
			func(error?.message);
		},
	});

	const onSubmit = async (data: AuthFormData) => {
		await loginPromise.promise(data);
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<Typography variant="h6">Login</Typography>
			<Box display="flex" flexDirection="column" gap={2}>
				<TextField
					id="username"
					label="Username"
					placeholder="Enter your username"
					variant="outlined"
					disabled={loginPromise.loading}
					{...form.register("username")}
					error={!!form.formState.errors.username}
					helperText={form.formState.errors.username?.message}
				/>
				<TextField
					id="password"
					label="Password"
					type="password"
					placeholder="Enter your password"
					variant="outlined"
					disabled={loginPromise.loading}
					{...form.register("password")}
					error={!!form.formState.errors.password}
					helperText={form.formState.errors.password?.message}
				/>
				<LoadingButton
					disabled={loginPromise.loading}
					loading={loginPromise.loading}
					type="submit"
					variant="contained"
					color="primary"
				>
					Login
				</LoadingButton>
			</Box>
		</form>
	);
};
