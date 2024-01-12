import slug from 'slug';
import Projects from './model.js';

import { mkdir, rmdir } from 'node:fs/promises';
import { join } from 'node:path';
import fileDirName from '../utils/file-dir-name.js';

const { __dirname } = fileDirName(import.meta);
const publicFolder = `${__dirname}/../../web/public`;

export const getAll = async (req, res) => {
    try {
        const projects = await Projects.find({}).populate('module');
        res.status(200).send(projects);
    } catch (error) {
        res.status(500).send(error);
    }
}


export const create = async (req, res) => {
    try {
        const {
            name,
        } = req.body

        const newProjects = new Projects({
            name, slug: slug(name)
        })

        const projects = await newProjects.save()

        await mkdir(join(publicFolder, projects.slug), { recursive: true });

        await projects.populate('module');
        res.status(200).send(projects);
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

        const projects = await Projects.findById(req.params.id);

        Object.assign(projects, { name, slug: slug(name) });

        const item = await projects.save();
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
                const item = await Projects.findOneAndDelete({ _id: v._id });
                await rmdir(join(publicFolder, item.slug), { recursive: true });
            })
        );
        res.status(200).send(req.body);
    } catch (error) {
        res.status(500).send(error);
    }
};