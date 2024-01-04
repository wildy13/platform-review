import { getAll, create, update, remove } from './controller.js';

import { isAdmin } from '../auth/service.js';

export default ((fastify, opts, done) => {
  fastify.get('/', getAll);
  fastify.post('/', create);
  fastify.put('/:id', update);
  fastify.delete('/remove', remove);
  done();
});
