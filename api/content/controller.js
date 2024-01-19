import slug from 'slug';
import Content from './model.js';
import Modules from '../module/model.js';
import Project from '../project/model.js'

import util from 'node:util';
import fs from 'node:fs';
import { pipeline } from 'node:stream';
import { mkdir, rmdir, rename, stat } from "node:fs/promises";
import { join } from "node:path";
import fileDirName from "../utils/file-dir-name.js";
import getFileExtension from '../utils/get-file-extension.js';
import unzipper from 'unzipper'

const { __dirname } = fileDirName(import.meta);
const publicFolder = `${__dirname}/../../web/public`;

const pump = util.promisify(pipeline);


export const getAll = async (req, res) => {
    try {
        const content = await Content.find({}).populate({
            path: "module",
            populate: {
                path: "project"
            }
        })
        res.status(200).send(content);
    } catch (error) {
        res.status(500).send(error);
    }
}


export const create = async (req, res) => {
    try {

        let project;
        let modules;
        let item;

        const parts = req.parts();

        for await (const part of parts) {
            if (part.type === 'field' && part.value != 'undifined') {
                const {
                    name,
                    module,
                } = JSON.parse(part.value);

                const newContent = new Content({
                    name, slug: slug(name), module,
                });
                item = await newContent.save()
                await item.populate({
                    path: "module",
                    populate: {
                        path: "project"
                    }
                });


                modules = await Modules.findById(module);
                project = await Project.findById(modules.project);

                await mkdir(join(publicFolder, 'arsip', project.slug, modules.slug, 'content', slug(name)), {
                    recursive: true,
                });

                await mkdir(join(publicFolder, 'digital-content', project.slug, modules.slug, 'pages', 'content', slug(name)), {
                    recursive: true,
                });

            } else if (part.type === 'file' && part.file) {
                const ext = getFileExtension(part.filename);

                if (ext === 'zip') {

                    const fileName = `${item.slug}.${ext}`;

                    const folder = `${publicFolder}/arsip/${project.slug}/${modules.slug}/content`
                    await pump(part.file, fs.createWriteStream(`${folder}/${item.slug}/${fileName}`));
                    const fileStat = await stat(`${publicFolder}/arsip/${project.slug}/${modules.slug}/content/${item.slug}/${fileName}`);

                    item.compressedFile = fileName;
                    item.compressedFileSize = fileStat.size;


                    const source = join(publicFolder, 'arsip', project.slug, modules.slug, 'content', item.slug, fileName);
                    const target = join(publicFolder, 'digital-content', project.slug, modules.slug, 'pages', 'content', item.slug);
                    console.log('target link :' + source)
                    fs.createReadStream(source)
                        .pipe(unzipper.Extract({ path: target }));
                }

            }
        }

        modules.content.push(item._id);
        await modules.save();

        res.status(200).send(item);
    } catch (error) {
        res.status(500).send(error)
    }
}

export const update = async (req, res) => {
    try {
        const { name } = req.body;

        const content = await Content.findById(req.params.id);
        const module = await Modules.findById(content.module);
        const project = await Project.findById(module.project);

        const oldPath = join(publicFolder, project.slug, module.slug, 'pages/content', content.slug);
        const newPath = join(publicFolder, project.slug, module.slug, 'pages/content', slug(name));

        await rename(oldPath, newPath);
        Object.assign(content, { name, slug: slug(name) });

        const item = await content.save();
        await item.populate({
            path: "module",
            populate: {
                path: "project"
            }
        })
        res.status(200).send(item);
    } catch (error) {
        res.status(500).send(error)
    }
}

export const remove = async (req, res) => {
    try {
        await Promise.all(
            req.body.map(async (v) => {

                const item = await Content.findById(v._id);
                const module = await Modules.findById(item.module);
                const project = await Project.findById(module.project);

                await module.content.pull(item._id);
                await module.save();
                await rmdir(join(publicFolder, project.slug, module.slug, 'pages/content', item.slug), { recursive: true });

                await Content.findOneAndDelete({ _id: v._id });
            })
        );
        res.status(200).send(req.body);
    } catch (error) {
        res.status(500).send(error);
    }
};