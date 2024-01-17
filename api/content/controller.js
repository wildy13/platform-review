import slug from 'slug';
import Content from './model.js';
import Modules from '../module/model.js';
import Project from '../project/model.js'

import { mkdir, rmdir, rename } from "node:fs/promises";
import { join } from "node:path";
import fileDirName from "../utils/file-dir-name.js";

const { __dirname } = fileDirName(import.meta);
const publicFolder = `${__dirname}/../../web/public/digital-content`;

export const getAll = async (req, res) => {
    try {
        const content = await Content.find({}).populate('module')
        res.status(200).send(content);
    } catch (error) {
        res.status(500).send(error);
    }
}


export const create = async (req, res) => {
    try {
        const {
            name,
            module,
        } = req.body;
        
        const newContent = new Content({
            name, slug: slug(name), module,
        })

        const content = await newContent.save()
        await content.populate('module');

        const modules = await Modules.findById(module);
        const project = await Project.findById(modules.project);

        await mkdir(join(publicFolder, project.slug, modules.slug, 'pages/content', slug(name)), {
            recursive: true,
        });

        modules.content.push(content._id);
        await modules.save();

        res.status(200).send(content);
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
        
        const oldPath = join(publicFolder, project.slug, module.slug,'pages/content',content.slug);
        const newPath = join(publicFolder, project.slug, module.slug,'pages/content',slug(name));
        
        await rename(oldPath, newPath);
        Object.assign(content, { name, slug: slug(name) });

        const item = await content.save();
        await item.populate('module')
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
                const module  =  await Modules.findById(item.module);
                const project = await  Project.findById(module.project);

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