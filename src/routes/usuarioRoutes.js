const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/registrar', usuarioController.registrar);
router.post('/login', usuarioController.login);
router.get('/', usuarioController.listarUsuarios);

module.exports = router;