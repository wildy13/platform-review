import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';
import bcrypt from 'mongoose-bcrypt';

const schema = new Schema({
  _id: { type: String, default: () => nanoid(12) },
  username: String,
  email: { type: String, unique: true, dropDups: true },
  password: { type: String, bcrypt: true },
  role: { type: String, ref: 'Roles' },
  bio: { type: String, maxlength: 500, default: 'Your Bio still empty' }
}, { timestamps: true });

schema.virtual('profile').get(function profile() {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    role: this.role,
    bio: this.bio
  };
});

schema.plugin(bcrypt);

export default model('Users', schema, 'users');
