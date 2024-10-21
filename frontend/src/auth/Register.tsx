import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Typography, Box } from '@mui/material';
import { usePromise } from '../hooks/usePromise';
import { AuthStoreData } from './auth.store';
import type { VitalProps } from '../utils/types';
import LoadingButton from '@mui/lab/LoadingButton';

type RegisterProps = {} & VitalProps;

const schema = z.object({
  username: z.string().min(2).max(32),
  password: z.string().min(8).max(32),
  key: z.string().min(1).max(64), // Added key validation
});

type Inputs = z.infer<typeof schema>;

export const Register = (props: RegisterProps) => {
  const authStore = AuthStoreData.hook();
  const form = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const registerPromise = usePromise({
    func: authStore.registrationAction,
    resolve: (data) => {
      console.log(data);
    },
    showError: false,
  });

  const onSubmit = async ({ username, password, key }: Inputs) => {
    // try {
    await registerPromise.promise({ username, password, key }); // Include key in registration
    // } catch (error) { }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={props.className}>
      <Typography variant="h6">Create a new account</Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          id="register-username"
          label="Username"
          placeholder="Enter your username"
          variant="outlined"
          disabled={registerPromise.loading}
          {...form.register("username")}
          error={!!form.formState.errors.username}
          helperText={form.formState.errors.username?.message}
        />
        <TextField
          id="register-password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          variant="outlined"
          disabled={registerPromise.loading}
          {...form.register("password")}
          error={!!form.formState.errors.password}
          helperText={form.formState.errors.password?.message}
        />
        <TextField
          id="register-key"
          label="Key"
          placeholder="Enter your key"
          variant="outlined"
          disabled={registerPromise.loading}
          {...form.register("key")}
          error={!!form.formState.errors.key}
          helperText={form.formState.errors.key?.message}
        />
        <LoadingButton disabled={registerPromise.loading} loading={registerPromise.loading} type='submit' variant="contained" color="primary">
          Register
        </LoadingButton>
      </Box>
    </form>
  );
};
