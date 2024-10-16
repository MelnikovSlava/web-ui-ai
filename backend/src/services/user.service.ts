import { db } from '../config/database';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import {  User} from '../types/user';

export const getUserById = async (id: number): Promise<User | undefined> => {
  return await db.select().from(usersTable).where(eq(usersTable.id, id)).get();
};
