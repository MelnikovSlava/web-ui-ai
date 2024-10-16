import type { Plugin, Server } from '@hapi/hapi';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { db } from '../config/database';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';

const jwtSecret = 'your-secret-key'; // В реальном приложении используйте переменные окружения

export const authPlugin: Plugin<null> = {
  name: 'auth',
  register: async (server: Server) => {
    server.auth.strategy('jwt', 'jwt', {
      keys: jwtSecret,
      verify: {
        aud: false,
        iss: false,
        sub: false,
        nbf: true,
        exp: true,
        maxAgeSec: 14400, // 4 часа
        timeSkewSec: 15,
        // algorithms: ['HS256'] // Перемещено сюда из verifyOptions
      },
      validate: async (artifacts: any, request: any, h: any) => {
        const user = await db.select().from(usersTable).where(eq(usersTable.id, artifacts.decoded.payload.id)).get();
        if (!user) {
          return { isValid: false };
        }
        return { isValid: true, credentials: user };
      }
    });

    server.auth.default('jwt');
  }
};
