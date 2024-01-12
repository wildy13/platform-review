import slug from 'slug';
import Modules from './model.js';
import Project from '../project/model.js';

import { mkdir, rmdir } from 'node:fs/promises';
import { join } from 'node:path';
import fileDirName from '../utils/file-dir-name.js';

const { __dirname } = fileDirName(import.meta);
const publicFolder = `${__dirname}/../../web/public`;

export const getAll = async (req, res) => {
    try {
        const modules = await Modules.find({})
            .populate('project')
            .populate('content')
            .populate('SignBy')
            .populate('signTo')
        res.status(200).send(modules);
    } catch (error) {
        res.status(500).send(error);
    }
}


export const create = async (req, res) => {
    let prjt;
    try {
        const {
            name,
            project,
            signTo,
            signBy
        } = req.body
        const newModules = new Modules({
            name, slug: slug(name), project, signBy, signTo
        })

        const modules = await newModules.save()
        await modules.populate('project');
        await modules.populate({
            path: 'signBy',
            select: '-password  -role',
        });
        await modules.populate({
            path: 'signTo',
            select: '-password  -role',
        });
        await mkdir(join(publicFolder, modules.slug), { recursive: true });
        prjt = await Project.findById(project);
        prjt.module.push(modules._id);
        await prjt.save();

        res.status(200).send(modules);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send({ message: 'Duplicated data, please review your input!' });
        } else {
            res.status(500).send(error);
        }
    }
}

export const update = async (req, res) => {
    try {
        const { name } = req.body;

        const modules = await Modules.findById(req.params.id);

        Object.assign(modules, { name, slug: slug(name) });

        const item = await modules.save();
        await item
            .populate('project')
            .populate('content')
            .populate('SignBy')
            .populate('signTo')
        res.status(200).send(item);
    } catch (error) {
        res.status(500).send(error)
    }
}

export const remove = async (req, res) => {
    try {
        await Promise.all(
            req.body.map(async (v) => {
                const item =  await Modules.findOneAndDelete({ _id: v._id });
                await rmdir(join(publicFolder, item.slug), { recursive: true });
            })
        );
        res.status(200).send(req.body);
    } catch (error) {
        res.status(500).send(error);
    }
};