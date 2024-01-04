import { getAll, create, update, remove } from './controller.js';

export default ((fastify, opts, done) => {
    fastify.get('/', getAll);
    fastify.post('/', create);
    fastify.put('/:id', update);
    fastify.delete('/remove', remove);
    done();
});