import Role from './model.js';

export const getAll = async (req,res) => {
    try {
        const role = await Role.find({});
        res.status(200).send(role);
    } catch (error) {
        res.status(500).send(error);
    }
}


export const create = async (req,res) => {
    try {
        const {
            name,
        } =  req.body

        const newRole = new Role({
            name,
        })

        const role = await newRole.save()
        res.status(200).send(role);
    } catch (error) {
        res.status(500).send(error)
    }
}

export const update = async (req, res) => {
    try {
      const { name } = req.body;
  
      const role = await Role.findById(req.params.id);
  
      Object.assign(role, { name });
  
      const item = await role.save();
  
      res.status(200).send(item);
    } catch (error) {
      res.status(500).send(error)
    }
  }
  
  export const remove = async (req, res) => {
    try {
        await Promise.all(
            req.body.map(async(v) => {
                await Role.findOneAndDelete({ _id: v._id })
            })
        );
        res.status(200).send(req.body);
    } catch (error) {
        res.status(500).send(error);
    }
  };