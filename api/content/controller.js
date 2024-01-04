import slug from 'slug';
import Content from './model.js';
import Modules from '../module/model.js';

export const getAll = async (req, res) => {
    try {
        const content = await Content.find({}).populate('module')
        res.status(200).send(content);
    } catch (error) {
        res.status(500).send(error);
    }
}


export const create = async (req, res) => {
    let mdls;
    try {
        const {
            name,
            module,
        } = req.body  
        const newContent = new Content({
            name, slug: slug(name), module,
        })

        const content = await newContent.save()
        await content.populate('module');

        mdls = await Modules.findById(project);
        mdls.content.push(content._id);
        await mdls.save();

        res.status(200).send(content);
    } catch (error) {
        res.status(500).send(error)
    }
}

export const update = async (req, res) => {
    try {
        const { name } = req.body;

        const content = await Content.findById(req.params.id);

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
                await Content.findOneAndDelete({ _id: v._id })
            })
        );
        res.status(200).send(req.body);
    } catch (error) {
        res.status(500).send(error);
    }
};