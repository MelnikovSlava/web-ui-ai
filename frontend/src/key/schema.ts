import { z } from "zod";

export const keySchema = z.object({
	key: z.string().min(3, "Too short"),
});

export type KeyFormData = z.infer<typeof keySchema>;
