import "dotenv/config";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import fastifySocketIO from "fastify-socket.io";
import slug from "slug";

import { connect } from "mongoose";

import User from "./users/model.js";
import setup from "./auth/passport.js";

import Logs from "./logs/model.js";
import Project from "./project/model.js";
import Module from "./module/model.js";
import Content from "./content/model.js";
import Users from "./users/model.js";

import auth from "./auth/index.js";
import users from "./users/index.js";
import roles from "./roles/index.js";
import project from "./project/index.js";
import module from "./module/index.js";
import content from "./content/index.js";

import { join } from "node:path";
import fileDirName from "./utils/file-dir-name.js";
const { __dirname } = fileDirName(import.meta);
const publicFolder = `${__dirname}/../../web/public/`;

const fastify = Fastify({
  logger: true,
});

setup(User);

fastify.register(fastifyCors);
fastify.register(fastifyJwt, {
  secret: process.env.SESSION_KEY,
  sign: { expiresIn: "8h" },
});
fastify.register(fastifyMultipart, {
  limits: { fileSize: 1000000000 },
});
fastify.register(fastifySocketIO, {
  cors: {
    origin: "http://190.1.6.208:4000",
  },
});
fastify.addHook("onRequest", async (req, res) => {
  try {
    if (req.headers.authorization) {
      await req.jwtVerify();
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

fastify.register(auth, { prefix: "/api/auth" });
fastify.register(users, { prefix: "/api/users" });
fastify.register(roles, { prefix: "/api/roles" });
fastify.register(project, { prefix: "/api/project" });
fastify.register(module, { prefix: "/api/module" });
fastify.register(content, { prefix: "/api/content" });

const connector = async () => {
  try {
    await connect(process.env.DB_URL, {
      serializeFunctions: true,
    });

    console.log("Connection has been established successfully.");
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

fastify.ready((err) => {
  if (err) throw err;

  fastify.io.on("connect", (socket) => {
    console.info("Socket connected!", socket.id);
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("logs-project:list", async (callback) => {
      const logs = await Logs.find();
      callback({ data: logs });
    });

    socket.on("logs-project:create", async (data, sender) => {
      const slugName = slug(data.name);
      const path = join(publicFolder, "digital-content", slugName);

      const newLogs = new Logs({
        level: "create",
        message: `${sender.username} already create ${data.name}`,
        source: `${path}`,
        metadata: [{ user: sender._id }],
      });

      const saved = await newLogs.save();
      socket.broadcast.emit("logs-project:create", saved);
      socket.emit("logs-project:create", saved);
    });

    socket.on("logs-module:create", async (data) => {
      const project = await Project.findById(data.project);
      const sender = await Users.findById(data.signBy);
      const receipt = await Users.findById(data.signTo);

      const slugName = slug(data.name);
      const path = join(
        publicFolder,
        "digital-content",
        project.slug,
        slugName
      );

      const newLogs = new Logs({
        level: "create",
        message: `${sender.username} already create ${data.name} in ${project.name} and sign to  ${receipt.username}`,
        source: `${path}`,
        metadata: [{ user: data.signTo }, { user: data.signBy }],
      });

      const saved = await newLogs.save();
      socket.broadcast.emit("logs-module:create", saved);
      socket.emit("logs-module:create", saved);
    });

    socket.on("logs-content:create", async (data, sender) => {
      const project = await Project.findById(data.project);
      const module = await Module.findById(data.module);
      const contentSlug = slug(data.name);

      const path = join(
        publicFolder,
        "digital-content",
        project.slug,
        module.slug,
        contentSlug
      );
      const newLogs = new Logs({
        level: "create",
        message: `${sender.username} already create content ${data.name} in ${module.name} `,
        source: `${path}`,
        metadata: [{ user: sender._id }],
      });
      const saved = await newLogs.save();
      socket.broadcast.emit("logs-content:create", saved);
      socket.emit("logs-content:create", saved);
    });

    socket.on("logs-project:update", async (data, sender) => {
      const project = await Project.findById(data._id);
      const name = project.name;

      const slugName = slug(data.name);
      const path = join(publicFolder, "digital-content", slugName);

      const newLogs = new Logs({
        level: "update",
        message: `${sender.username} already update project from ${name} to ${data.name}`,
        source: `${path}`,
        metadata: [{ user: sender._id }],
      });

      const saved = await newLogs.save();
      socket.broadcast.emit("logs-project:update", saved);
      socket.emit("logs-project:update", saved);
    });

    socket.on("logs-module:update", async (data) => {
      const module = await Module.findById(data._id);
      const project = await Project.findById(module.project);
      const sender = await Users.findById(data.signBy);

      const slugName = slug(data.name);
      const path = join(
        publicFolder,
        "digital-content",
        project.slug,
        slugName
      );

      const newLogs = new Logs({
        level: "update",
        message: `${sender.username} already update module from ${module.name} to ${data.name} in ${project.name}`,
        source: `${path}`,
        metadata: [{ user: data.signTo }, { user: data.signBy }],
      });

      const saved = await newLogs.save();
      socket.broadcast.emit("logs-module:update", saved);
      socket.emit("logs-module:update", saved);
    });

    socket.on("logs-content:update", async (data, sender) => {
      const module = await Module.findById(data.module);
      const project = await Project.findById(module.project);
      const content = await Content.findById(data._id);
      const contentSlug = slug(data.name);

      const path = join(
        publicFolder,
        "digital-content",
        project.slug,
        module.slug,
        "pages/content",
        contentSlug
      );
      const newLogs = new Logs({
        level: "update",
        message: `${sender.username} already update content from ${content.name} to ${data.name} in ${module.name}`,
        source: `${path}`,
        metadata: [{ user: data.signTo }, { user: data.signBy }],
      });

      const saved = await newLogs.save();
      socket.broadcast.emit("logs-content:update", saved);
      socket.emit("logs-content:update", saved);
    });

    socket.on("logs-project:delete", async (data, sender) => {
      await Promise.all(
        data.map(async (v) => {
          const project = await Project.findById(v._id);
          const path = join(publicFolder, "digital-content", project.slug);

          const newLogs = new Logs({
            level: "delete",
            message: `${sender.username} already delete project ${project.name}`,
            source: `${path}`,
            metadata: [{ user: data.signTo }, { user: data.signBy }],
          });

          const saved = await newLogs.save();
          socket.broadcast.emit("logs-project:delete", saved);
          socket.emit("logs-project:delete", saved);
        })
      );
    });

    socket.on("logs-module:delete", async (data, sender) => {
        await Promise.all(
            data.map( async(v) => {
                const module = await Module.findById(v._id);
                const project = await  Project.findById(module.project);

                const path = join(publicFolder, 'digital-content', project.slug, module.slug);   

                const newLogs = new Logs({
                    level: 'delete',
                    message: `${sender.username} already delete module ${module.name} in ${project.name}`,
                    source: `${path}`,
                    metadata: [{user: data.signTo}, {user:data.signBy}]
                });
    
                const saved = await newLogs.save();
                  socket.broadcast.emit('logs-module:delete', saved);
                  socket.emit('logs-module:delete', saved);  
            })
        )
    });

    socket.on("logs-content:delete", async (data, sender) => {
        await Promise.all(
            data.map( async(v) => {
                const content = await Content.findById(v._id);
                const module = await Module.findById(content.module);
                const project  = await Project.findById(module.project);

                const path = join(publicFolder, 'digital-content', project.slug, module.slug, 'pages/content', content.slug);   

                const newLogs = new Logs({
                    level: 'delete',
                    message: `${sender.username} already delete content ${content.name} in ${module.name} of ${project.name}`,
                    source: `${path}`,
                    metadata: [{user: data.signTo}, {user:data.signBy}]
                });
    
                const saved = await newLogs.save();
                  socket.broadcast.emit('logs-content:delete', saved);
                  socket.emit('logs-content:delete', saved);  
            })
        )
    });
  });
});

start();
