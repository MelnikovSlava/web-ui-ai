import type { Server } from '@hapi/hapi';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';

const jwtSecret = 'your-secret-key'; // В реальном приложении используйте переменные окружения

export const authRoutes = (server: Server) => {
  server.route({
    method: 'POST',
    path: '/register',
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required()
        })
      }
    },
    handler: async (request, h) => {
      const { username, password } = request.payload as { username: string; password: string };
      
      const existingUser = await db.select().from(usersTable).where(eq(usersTable.username, username)).get();
      if (existingUser) {
        return h.response({ message: 'Username already exists' }).code(400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await db.insert(usersTable).values({ username, password: hashedPassword });

      return h.response({ message: 'User registered successfully' }).code(201);
    }
  });

  server.route({
    method: 'POST',
    path: '/login',
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required()
        })
      }
    },
    handler: async (request, h) => {
      const { username, password } = request.payload as { username: string; password: string };
      
      const user = await db.select().from(usersTable).where(eq(usersTable.username, username)).get();
      if (!user) {
        return h.response({ message: 'Invalid credentials' }).code(401);
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return h.response({ message: 'Invalid credentials' }).code(401);
      }

      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
      return { token };
    }
  });
};
