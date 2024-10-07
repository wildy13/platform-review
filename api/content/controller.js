import slug from 'slug';
import Content from './model.js';
import Modules from '../module/model.js';
import Project from '../project/model.js'

import util from 'node:util';
import fs from 'node:fs';
import { pipeline } from 'node:stream';
import { mkdir, rmdir, rename, stat } from "node:fs/promises";
import { copy, emptyDir } from 'fs-extra'
import { join } from "node:path";
import fileDirName from "../utils/file-dir-name.js";
import getFileExtension from '../utils/get-file-extension.js';
import unZip from 'adm-zip'

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
        const { name, module, status } = req.body;
        const newContent = new Content({
            name, slug: slug(name), module, status
        });

        const item = await newContent.save();
        await item.populate({
            path: "module",
            populate: {
                path: "project"
            }
        });

        res.status(200).send(item);
         
    } catch (error) {
        res.status(500).send(error);
    }
}


export const upload = async(req, res) => {
    const parts = req.parts();

    for await (const part of parts) {
        if (part.type === 'file' && part.file) {
            const ext = getFileExtension(part.filename);
            const { _id, slug, module, status } = JSON.parse(part.fields.data.value);
            
            const modules = await Modules.findById(module._id);
            const prjt = await Project.findById(modules.project);

            const item = await Content.findById(_id);
            const arsipFolder = `${publicFolder}/arsip/${prjt.slug}/${modules.slug}/content/`;
            await mkdir(join(arsipFolder, slug), { recursive: true });
            if (ext === 'zip') {
                const fileName = `${slug}.${ext}`;
                const folder = `${publicFolder}/arsip/${prjt.slug}/${modules.slug}/content`;
                await pump(part.file, fs.createWriteStream(`${folder}/${slug}/${fileName}`));
                const fileStat = await stat(`${publicFolder}/arsip/${prjt.slug}/${modules.slug}/content/${slug}/${fileName}`);

                const source = join(publicFolder, 'arsip', prjt.slug, modules.slug, 'content', slug, fileName);
                const target = join(publicFolder, 'digital-content', prjt.slug, modules.slug, 'pages', 'content', slug);

                const zip = new unZip(source);
                const zipEntires = zip.getEntries();
                zipEntires.forEach(function (zipEntry) {
                    if (zipEntry.entryName != undefined) {
                        zip.extractAllTo(target, true);
                    }
                });

                item.status = true;
                item.compressedFile = fileName;
                item.compressedFileSize = fileStat.size;

                modules.content.push(_id);
                await modules.save();
                await item.save();
                res.status(200).send(item);
            }
        }
    }
}
export const update = async (req, res) => {
    try {
        const parts = req.parts();
        for await (const part of parts) {

            if (part.type === 'field' && part.value != undefined) {
                const { _id, name, module, status } = JSON.parse(part.fields.data.value);
                const item = await Content.findById(_id);
                const Module = await Modules.findById(item.module);
                const project = await Project.findById(Module.project);
                
                await mkdir(join(publicFolder, 'digital-content', project.slug, Module.slug, 'pages/content', slug(name)));
                await copy(join(publicFolder, 'digital-content', project.slug, Module.slug, 'pages/content', item.slug), join(publicFolder, 'digital-content', project.slug, Module.slug, 'pages/content', slug(name)));
                await emptyDir(join(publicFolder, 'digital-content', project.slug, Module.slug, 'pages/content', item.slug)).catch(error => console.error('Gagal mengosongkan direktori:', error));
                await rmdir(join(publicFolder, 'digital-content', project.slug, Module.slug, 'pages/content', item.slug)).catch(error => console.error('Gagal menghapus direktori:', error));
                

                Object.assign(item, { name, slug: slug(name) });
                await item.save();
                await item.populate({
                    path: "module",
                    populate: {
                        path: "project"
                    }
                });
                res.status(200).send(item);
            } else if (part.type === 'file' && part.file) {
                const ext = getFileExtension(part.filename);
                const { _id, slug, module, status } = JSON.parse(part.fields.data.value);

                const item = await Content.findById(_id);
                const Module = await Modules.findById(module._id);
                const prjt = await Project.findById(Module.project)

                if (ext === 'zip') {
                    const fileName = `${slug}.${ext}`;
                    const folder = `${publicFolder}/arsip/${prjt.slug}/${Module.slug}/content`;

                    if (status === true) {
                        await rmdir(join(publicFolder, prjt.slug, Module.slug, 'pages/content', item.slug));
                        await pump(part.file, fs.createWriteStream(`${folder}/${slug}/${fileName}`));

                        const fileStat = await stat(`${publicFolder}/arsip/${prjt.slug}/${Module.slug}/content/${slug}/${fileName}`);
                        const source = join(publicFolder, 'arsip', prjt.slug, Module.slug, 'content', slug, fileName);
                        const target = join(publicFolder, 'digital-content', prjt.slug, Module.slug, 'pages', 'content', slug);


                        const zip = new unZip(source);
                        const zipEntires = zip.getEntries();
                        zipEntires.forEach(function (zipEntry) {
                            if (zipEntry.entryName != undefined) {
                                zip.extractAllTo(target, true);
                            }
                        });

                        item.compressedFile = fileName;
                        item.compressedFileSize = fileStat.size;
                    }
                }

            }
        }
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
                await rmdir(join(publicFolder, 'digital-content', project.slug, module.slug, 'pages/content', item.slug), { recursive: true });

                await Content.findOneAndDelete({ _id: v._id });
            })
        );
        res.status(200).send(req.body);
    } catch (error) {
        res.status(500).send(error);
    }
};