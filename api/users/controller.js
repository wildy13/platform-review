import User from './model.js';

export const getAll = async (req, res) => {
  try {
    const users = await User.find({}, '-password').populate('role');

    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    await user.populate('role');
    res.status(200).send({ user: user.profile });
  } catch (err) {
    res.status(500).send(err);
  }
};

export const create = async (req, res) => {
  try {
    const newUser = new User(req.body);

    const user = await newUser.save();
    await user.populate('role');
    res.status(200).send(user.profile);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send('This email is already registered, please input another email');
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
      path: 'role',
      select: '-password'
    });

    res.status(200).send(item);
  } catch (error) {
    res.status(500).send(error)
  }
}

export const remove = async (req, res) => {
  try {
    await Promise.all(
      req.body.map(async (v) => {
        await User.findOneAndDelete({ _id: v._id })
      })
    );
    res.status(200).send(req.body);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'Pengguna tidak ditemukan' });
    }

    user.bio = req.body.bio

    const item = await user.save();
    res.status(200).send(item);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Terjadi kesalahan server' });
  }
};
