import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';

const schema = new Schema({
    _id: { type: String, default: () => nanoid(12) },
    name: { type: String, dropDups: true },
    slug: { type: String },
    signBy: { type: String, ref: 'Users' },
    signTo: [{ type: String, ref: 'Users' }],
    project: { type: String, ref: 'Projects' },
    content: [{ type: String, ref: 'Content' }],
}, { timestamps: true });

export default model('Modules', schema, 'modules');