const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/registrar', usuarioController.registrar);
router.post('/login', usuarioController.login);
router.get('/', usuarioController.listarUsuarios);
router.get('/:id', usuarioController.getUsuario);
router.put('/:id', usuarioController.atualizarUsuario);

module.exports = router;