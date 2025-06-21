const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller');
const auth = require('../middlewares/auth');

// Rutas públicas
router.get('/', controller.index);
router.post('/', controller.store);
router.post('/login', controller.login);

// Rutas protegidas
router.get('/list/pagination', controller.listPaginated);
router.get('/:id', auth, controller.show);
router.put('/:id', auth, controller.update);
router.patch('/:id', auth, controller.patch);
router.delete('/:id', auth, controller.destroy);
router.get('/:id/tasks', auth, controller.userWithTasks);

module.exports = router;
