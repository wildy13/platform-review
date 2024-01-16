import slug from "slug";
import Modules from "./model.js";
import Project from "../project/model.js";

import { mkdir, rmdir, rename } from "node:fs/promises";
import { join } from "node:path";
import fileDirName from "../utils/file-dir-name.js";
import { renameSync } from "node:fs";

const { __dirname } = fileDirName(import.meta);
const publicFolder = `${__dirname}/../../web/public/digital-content`;

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
  let prjt;
  try {
    const { name, project, signTo, signBy } = req.body;
    const newModules = new Modules({
      name,
      slug: slug(name),
      project,
      signBy,
      signTo,
    });

    const modules = await newModules.save();
    await modules.populate("project");
    await modules.populate({
      path: "signBy",
      select: "-password  -role",
    });
    await modules.populate({
      path: "signTo",
      select: "-password  -role",
    });

    prjt = await Project.findById(project);
    await mkdir(join(publicFolder, prjt.slug, modules.slug), {
      recursive: true,
    });
    await mkdir(join(publicFolder, prjt.slug, modules.slug, "pages"), {
      recursive: true,
    });
    await mkdir(join(publicFolder, prjt.slug, modules.slug, "assets"), {
      recursive: true,
    });
    await mkdir(
      join(publicFolder, prjt.slug, modules.slug, "pages", "background-theory"),
      { recursive: true }
    );
    await mkdir(
      join(publicFolder, prjt.slug, modules.slug, "pages", "glossary"),
      { recursive: true }
    );
    await mkdir(
      join(publicFolder, prjt.slug, modules.slug, "pages", "content"),
      { recursive: true }
    );
    await mkdir(
      join(publicFolder, prjt.slug, modules.slug, "assets", "image"),
      { recursive: true }
    );
    prjt.module.push(modules._id);
    await prjt.save();

    res.status(200).send(modules);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .send({ message: "Duplicated data, please review your input!" });
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
    const oldPath = join(publicFolder, prjt.slug, modules.slug);

    Object.assign(modules, { name, slug: slug(name) });
    const mdl = slug(name);

    const newPath = join(publicFolder, prjt.slug, mdl);
    await renameSync(oldPath, newPath);
    
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
        const item = await Modules.findOneAndDelete({ _id: v._id });
        await rmdir(join(publicFolder, item.slug), { recursive: true });
      })
    );
    res.status(200).send(req.body);
  } catch (error) {
    res.status(500).send(error);
  }
};
