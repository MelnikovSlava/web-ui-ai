import Hapi from '@hapi/hapi';
import { authPlugin } from './plugins/auth';
import { authRoutes } from './routes/auth';

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  });

  await server.register([
    require('@hapi/jwt'),
    authPlugin
  ]);

  authRoutes(server);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
