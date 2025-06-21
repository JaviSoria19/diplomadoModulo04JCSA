const express = require('express');
const router = express.Router();
const controller = require('../controllers/task.controller');
const auth = require('../middlewares/auth');

// Todas las rutas están protegidas
router.use(auth);

router.get('/', controller.index);
router.post('/', controller.store);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
