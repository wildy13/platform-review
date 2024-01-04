import slug from 'slug';
import { mkdir, rmdir } from 'node:fs/promises';
import Projects from './model.js';

import fileDirName from '../utils/file-dir-name.js';

const { __dirname } = fileDirName(import.meta);
console.log(__dirname);

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
        await projects.populate('module');
        res.status(200).send(projects);
    } catch (error) {
        res.status(500).send(error)
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
                await Projects.findOneAndDelete({ _id: v._id })
            })
        );
        res.status(200).send(req.body);
    } catch (error) {
        res.status(500).send(error);
    }
};