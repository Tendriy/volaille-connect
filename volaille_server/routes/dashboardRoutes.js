const express = require('express');
const { 
    getDashboardData, 
    getRecentLots, 
    getAlertes,
    getFullDashboard 
} = require('../controllers/dashboardController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Toutes les routes du dashboard nécessitent une authentification
router.use(authenticateToken);

// Route principale du dashboard (pour les statistiques)
router.get('/', getDashboardData);

// Route pour les lots récents
router.get('/recent-lots', getRecentLots);

// Route pour les alertes
router.get('/alertes', getAlertes);

// Route complète (tout en une seule requête)
router.get('/full', getFullDashboard);

module.exports = router;