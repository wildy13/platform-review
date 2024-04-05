import User from "./model.js";

import util from 'node:util';
import fs from 'node:fs';
import { pipeline } from 'node:stream';
import { mkdir, rmdir, rename, stat, rm } from "node:fs/promises";
import { join } from "node:path";
import fileDirName from "../utils/file-dir-name.js";
import getFileExtension from '../utils/get-file-extension.js';

import slug from "slug";
import jimp from 'jimp';

const { __dirname } = fileDirName(import.meta);
const publicFolder = `${__dirname}/../../web/public/`;

const pump = util.promisify(pipeline);

export const getAll = async (req, res) => {
  try {
    const users = await User.find({}, "-password").populate("role");

    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    await user.populate("role");
    res.status(200).send({ user: user.profile });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const create = async (req, res) => {
  try {
    const newUser = new User(req.body);

    const user = await newUser.save();
    await user.populate("role");
    res.status(200).send(user.profile);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .send("This email is already registered, please input another email");
    } else {
      res.status(500).send(error);
    }
  }
};

export const update = async (req, res) => {
  try {
    const { username, email, role } = req.body;

    const user = await User.findById(req.params.id);

    Object.assign(user, { username, email, role });

    const item = await user.save();
    await item.populate({
      path: "role",
      select: "-password",
    });

    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const remove = async (req, res) => {
  try {
    await Promise.all(
      req.body.map(async (v) => {
        await User.findOneAndDelete({ _id: v._id });
      })
    );
    res.status(200).send(req.body);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const profile = async (req, res) => {
  try {
    const parts = req.parts();

    if (!parts) {
      return res.status(400).send("No parts found in the request");
    }

    for await (const part of parts) {

      if (part.type === "file" && part.file) {
        const user = await User.findById(req.params.id);

        const ext = getFileExtension(part.filename);
        await mkdir(join(publicFolder, 'image', 'users'), { recursive: true });
        const folder = `${publicFolder}/image/users/`;
        const fileNameTmp = `${slug(user.username)}-tmp.png`;
        const fileName = `${slug(user.username)}.png`;
        if (ext === "png" || ext === "jpg" || ext === "jpeg") {
          await pump(part.file, fs.createWriteStream(`${folder}/${fileNameTmp}`));
          const image = await jimp.read(`${folder}/${fileNameTmp}`);
          await image.resize(480, 270).write(`${folder}/${fileName}`);
          await rm(join(folder, fileNameTmp), { recursive: true });
          res.status(200).send(user);
        }
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal Server Error");
  }
};

export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { newPassword, oldPassword } = req.body;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await user.verifyPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).send(user);
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
