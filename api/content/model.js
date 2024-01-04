import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';

const schema = new Schema({
    _id: { type: String, default: () => nanoid(12) },
    name: { type: String, unique: true, dropDups: true },
    slug: { type: String },
    module: { type: String, ref: 'Modules' }
}, { timestamps: true });

export default model('Content', schema, 'content');