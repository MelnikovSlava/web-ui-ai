import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TextField, Button, Typography } from '@mui/material';
import type { VitalProps } from '../utils/types';

type LoginProps = {} & VitalProps;

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = (props: LoginProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Login data:", data);
    // Here you would typically send the data to your server
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Typography variant="h6">Login</Typography>
        <TextField
          id="username"
          label="Username"
          placeholder="Enter your username"
          variant="outlined"
          fullWidth
          {...register("username")}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
      </div>
      <div className="space-y-2">
        <TextField
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          variant="outlined"
          fullWidth
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      </div>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Log In
      </Button>
    </form>
  );
};
