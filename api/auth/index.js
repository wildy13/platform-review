import { login, logout } from './controller.js';
import { getMe } from '../users/controller.js';

import { isAuthenticated } from './service.js';

export default ((fastify, opts, done) => {
  fastify.get('/session', { preHandler: [isAuthenticated()] }, getMe);
  fastify.post('/login', login);
  fastify.post('/logout', logout);

  done();
});
