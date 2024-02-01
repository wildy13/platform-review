import slug from "slug";
import Modules from "./model.js";
import Project from "../project/model.js";
import Content from "../content/model.js";


import util from 'node:util';
import fs from 'node:fs';
import { pipeline } from 'node:stream';
import { mkdir, rmdir, rename, stat } from "node:fs/promises";
import { join } from "node:path";
import fileDirName from "../utils/file-dir-name.js";
import getFileExtension from '../utils/get-file-extension.js';
import unZip from 'adm-zip'


const { __dirname } = fileDirName(import.meta);
const publicFolder = `${__dirname}/../../web/public/`;

const pump = util.promisify(pipeline);


export const getAll = async (req, res) => {
  try {
    const modules = await Modules.find({})
      .populate("project")
      .populate("content")
      .populate("signBy")
      .populate("signTo");
    res.status(200).send(modules);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const create = async (req, res) => {
  try {
    const parts = req.parts();

    let prjt;
    let item;
    let arsipFolder;
    let projectFolder;

    for await (const part of parts) {
      if (part.type === 'field' && part.value != 'undifined') {
        const { name, project, signTo, signBy } = JSON.parse(part.value);
        const newModules = new Modules({
          name,
          slug: slug(name),
          project,
          signBy,
          signTo,
        });
        item = await newModules.save();
        await item.populate("project");
        await item.populate({
          path: "signBy",
          select: "-password  -role",
        });
        await item.populate({
          path: "signTo",
          select: "-password  -role",
        });

        prjt = await Project.findById(project);
        prjt.module.push(item._id);
        await prjt.save();

        projectFolder = `${publicFolder}/digital-content/`;
        arsipFolder = `${publicFolder}/arsip/${prjt.slug}`;
        await mkdir(join(arsipFolder, item.slug), { recursive: true });
      } else if (part.type === 'file' && part.file) {
        const ext = getFileExtension(part.filename);
        const folder = `${arsipFolder}/${item.slug}`;
        const fileName = `${item.slug}.${ext}`;

        if (ext === 'zip') {
          await pump(part.file, fs.createWriteStream(`${folder}/${fileName}`));

          const source = join(publicFolder, 'arsip', prjt.slug, item.slug, fileName);
          const target = join(publicFolder, 'digital-content', prjt.slug, item.slug);

          const zip = new unZip(source);
          const zipEntires = zip.getEntries();
          zipEntires.forEach(function (zipEntry) {
            if (zipEntry.entryName != undefined) {
              zip.extractAllTo(target, true);
            }
          });
        }


        await item.save();
      }
    }
    res.status(200).send(item);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send({ message: 'Duplicated data, please review your input!' });
    } else {
      res.status(500).send(error);
    }
  }
};

export const update = async (req, res) => {
  let prjt;
  try {
    const { name } = req.body;
    const modules = await Modules.findById(req.params.id);

    prjt = await Project.findById(modules.project);
    const oldPath = join(publicFolder, 'digital-content', prjt.slug, modules.slug);

    Object.assign(modules, { name, slug: slug(name) });

    const newPath = join(publicFolder, 'digital-content', prjt.slug, slug(name));
    await rename(oldPath, newPath);

    const item = await modules.save();
    await item.populate("project");
    await item.populate("content");
    await item.populate("signBy");
    await item.populate("signTo");
    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const remove = async (req, res) => {

  try {
    await Promise.all(
      req.body.map(async (v) => {
        const item = await Modules.findById(v._id);
        const project = await Project.findById(item.project);
        const content = await Content.find({ module: item._id })
        content.map(async (val) => {
          await Content.findOneAndDelete({ _id: val._id });
          await Content.save();
        });
        await project.module.pull(item._id);
        await project.save();

        await rmdir(join(publicFolder, 'digital-content', project.slug, item.slug), { recursive: true });

        await Modules.findOneAndDelete({ _id: v._id });

      })
    );
    res.status(200).send(req.body);
  } catch (error) {
    res.status(500).send(error);
  }
};
