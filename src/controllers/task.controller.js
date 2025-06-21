const { Task } = require('../models');

module.exports = {
  // Listar tareas del usuario autenticado
  async index(req, res) {
    const tasks = await Task.findAll({
      where: { user_id: req.user.id }
    });
    res.json(tasks);
  },

  // Crear tarea
  async store(req, res) {
    const { name } = req.body;
    const task = await Task.create({
      name,
      done: false,
      user_id: req.user.id
    });
    res.status(201).json(task);
  },

  // Obtener una tarea específica
  async show(req, res) {
    const task = await Task.findByPk(req.params.id);
    if (!task || task.user_id !== req.user.id) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
  },

  // Editar completamente el nombre de la tarea
  async update(req, res) {
    const { name } = req.body;
    const [updated] = await Task.update({ name }, {
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });
    res.json(updated); // Devuelve 1 si fue exitoso
  },

  // Marcar como hecho/no hecho
  async patch(req, res) {
    const { done } = req.body;
    const [updated] = await Task.update({ done }, {
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });
    res.json(updated); // Devuelve 1 si fue exitoso
  },

  // Eliminar una tarea
  async destroy(req, res) {
    const deleted = await Task.destroy({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });
    res.json(deleted); // Devuelve 1 si fue exitoso
  }
};
