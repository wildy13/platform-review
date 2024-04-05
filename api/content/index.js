import { getAll, create, update, remove, upload } from './controller.js';

export default ((fastify, opts, done) => {
    fastify.get('/', getAll);
    fastify.post('/', create);
    fastify.post('/upload', upload);
    fastify.put('/:id', update);
    fastify.delete('/remove', remove);
    done();
});