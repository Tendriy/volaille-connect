const express = require('express');
const { addVente, getAllVentes } = require('../controllers/venteController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.post('/', addVente);
router.get('/', getAllVentes);

module.exports = router;