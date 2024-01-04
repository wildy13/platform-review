import 'dotenv/config';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';

import { connect } from 'mongoose';

import User from './users/model.js';
import setup from './auth/passport.js';


import auth from './auth/index.js';
import users from './users/index.js';
import roles from './roles/index.js';
import project from './project/index.js';
import module from './module/index.js';
import content from './content/index.js';

const fastify = Fastify({
    logger: true
});

setup(User);

fastify.register(fastifyCors);
fastify.register(fastifyJwt, { secret: process.env.SESSION_KEY, sign: { expiresIn: '8h' } });
fastify.register(fastifyMultipart, {
    limits: { fileSize: 1000000000 }
});

fastify.addHook('onRequest', async (req, res) => {
    try {
        if (req.headers.authorization) {
            await req.jwtVerify();
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

fastify.register(auth, { prefix: '/api/auth' });
fastify.register(users, { prefix: '/api/users' });
fastify.register(roles, { prefix: '/api/roles' });
fastify.register(project, { prefix: '/api/project' });
fastify.register(module, { prefix: '/api/module' });
fastify.register(content, { prefix: '/api/content' });

const connector = async () => {
    try {
        await connect(process.env.DB_URL, {
            serializeFunctions: true,
        });

        console.log('Connection has been established successfully.');
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

const start = async () => {
    try {
        await fastify.listen({ port: process.env.PORT, host: process.env.HOST });
        await connector();
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();