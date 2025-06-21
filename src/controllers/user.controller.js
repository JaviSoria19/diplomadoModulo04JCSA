const { User, Task } = require('../models');
const bcrypt = require('bcrypt');
const { signToken } = require('../common/jwt');

module.exports = {
  async index(req, res) {
    const users = await User.findAll();
    res.json(users);
  },

  async show(req, res) {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  },

  async store(req, res) {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, status: 'active' });
    res.status(201).json(user);
  },

  async login(req, res) {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = signToken({ id: user.id, username: user.username });
    res.json({ token });
  },

  async update(req, res) {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.update({ username, password: hashedPassword }, { where: { id: req.params.id } });
    res.json(result[0]); // Devuelve "1" si fue exitoso
  },

  async patch(req, res) {
    const { status } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.status = status;
    await user.save();
    res.json(user);
  },

  async destroy(req, res) {
    const result = await User.destroy({ where: { id: req.params.id } });
    res.json(result); // Devuelve "1" si fue exitoso
  },

  async userWithTasks(req, res) {
    const user = await User.findByPk(req.params.id, {
      include: { model: Task, attributes: ['name', 'done'] }
    });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({
      username: user.username,
      tasks: user.Tasks
    });
  }
};

async function listPaginated(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const orderBy = req.query.orderBy || 'id';
  const orderDir = req.query.orderDir?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const offset = (page - 1) * limit;

  const { count, rows } = await User.findAndCountAll({
    where: {
      username: {
        [require('sequelize').Op.iLike]: `%${search}%`
      }
    },
    attributes: ['id', 'username', 'status'],
    limit,
    offset,
    order: [[orderBy, orderDir]]
  });

  res.json({
    total: count,
    page,
    pages: Math.ceil(count / limit),
    data: rows
  });
}

module.exports.listPaginated = listPaginated;
