import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';


const metadataSchema = new Schema({
    user: { type: String, ref: 'Users' },
});

const schema = new Schema({
    _id: { type: String, default: () => nanoid(12) },
    level: { type: String },
    message: { type: String },
    source: String,
    metadata: [metadataSchema]
}, { timestamps: true });

export default model('Logs', schema, 'logs');