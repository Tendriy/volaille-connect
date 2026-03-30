const db = require('../config/database');
const Lot = require('../models/Lot');
const Stock = require('../models/Stock');
const Vaccin = require('../models/Vaccin');

// Récupérer toutes les données du tableau de bord
const getDashboardData = async (req, res) => {
    const userId = req.userId;

    try {
        // 1. Récupérer tous les lots
        const [lots] = await db.query(
            'SELECT * FROM lots WHERE user_id = ?',
            [userId]
        );

        // 2. Compter les lots actifs
        const lotsActifs = lots.filter(lot => lot.statut === 'actif').length;

        // 3. Calculer le nombre total de volailles vivantes
        let totalVolailles = 0;
        for (const lot of lots) {
            if (lot.statut === 'actif') {
                // Récupérer le total des morts
                const [morts] = await db.query(
                    'SELECT SUM(mortalite_jour) as total_morts FROM suivi_quotidien WHERE lot_id = ?',
                    [lot.id]
                );
                // Récupérer le total des ventes
                const [ventes] = await db.query(
                    'SELECT SUM(nombre_vendu) as total_vendus FROM ventes WHERE lot_id = ?',
                    [lot.id]
                );
                
                const totalMorts = morts[0].total_morts || 0;
                const totalVendus = ventes[0].total_vendus || 0;
                const restant = lot.nombre_initial - totalMorts - totalVendus;
                
                if (restant > 0) {
                    totalVolailles += restant;
                }
            }
        }

        // 4. Compter les alertes stock
        const [stock] = await db.query(
            'SELECT * FROM stock_aliment WHERE user_id = ?',
            [userId]
        );
        let alertesStock = 0;
        for (const item of stock) {
            if (item.quantite <= item.seuil_alerte) {
                alertesStock++;
            }
        }

        // 5. Compter les vaccins programmés
        const [vaccins] = await db.query(
            `SELECT v.* FROM vaccinations v 
             JOIN lots l ON v.lot_id = l.id 
             WHERE l.user_id = ? AND v.statut = 'programme' 
             AND v.date_programmee >= CURDATE()`,
            [userId]
        );
        const vaccinsProgrammes = vaccins.length;

        // 6. Retourner les données
        res.json({
            lots_actifs: lotsActifs,
            total_volailles: totalVolailles,
            alertes_stock: alertesStock,
            vaccins_programmes: vaccinsProgrammes
        });

    } catch (error) {
        console.error('Erreur dashboard:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données du tableau de bord' });
    }
};

// Récupérer les lots récents (5 derniers)
const getRecentLots = async (req, res) => {
    const userId = req.userId;

    try {
        const [lots] = await db.query(
            'SELECT * FROM lots WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
            [userId]
        );

        // Ajouter l'âge pour chaque lot
        for (let lot of lots) {
            const [morts] = await db.query(
                'SELECT SUM(mortalite_jour) as total_morts FROM suivi_quotidien WHERE lot_id = ?',
                [lot.id]
            );
            const totalMorts = morts[0].total_morts || 0;
            lot.taux_mortalite = ((totalMorts / lot.nombre_initial) * 100).toFixed(2);
            
            // Calculer l'âge
            const arrivee = new Date(lot.date_arrivee);
            const aujourdhui = new Date();
            const diffTime = Math.abs(aujourdhui - arrivee);
            lot.age = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        res.json(lots);

    } catch (error) {
        console.error('Erreur lots récents:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des lots récents' });
    }
};

// Récupérer les alertes (stock + vaccins)
const getAlertes = async (req, res) => {
    const userId = req.userId;

    try {
        // Alertes stock
        const [stock] = await db.query(
            'SELECT * FROM stock_aliment WHERE user_id = ?',
            [userId]
        );
        
        const alertesStock = stock.filter(item => item.quantite <= item.seuil_alerte).map(item => ({
            ...item,
            alerte: true,
            message_alerte: item.quantite <= item.seuil_alerte ? "ATTENTION : Stock faible" : "Stock suffisant"
        }));

        // Alertes vaccins
        const [vaccins] = await db.query(
            `SELECT v.*, l.nom_lot 
             FROM vaccinations v 
             JOIN lots l ON v.lot_id = l.id 
             WHERE l.user_id = ? 
             AND v.statut = 'programme'
             AND v.date_programmee >= CURDATE()
             AND v.date_programmee <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)`,
            [userId]
        );

        const aujourdhui = new Date();
        const alertesVaccins = vaccins.map(vaccin => {
            const dateProgrammee = new Date(vaccin.date_programmee);
            const diffJours = Math.ceil((dateProgrammee - aujourdhui) / (1000 * 60 * 60 * 24));
            return {
                ...vaccin,
                message: `Vaccin ${vaccin.type_vaccin} dans ${diffJours} jour${diffJours > 1 ? 's' : ''}`
            };
        });

        res.json({
            alertesStock,
            alertesVaccins
        });

    } catch (error) {
        console.error('Erreur alertes:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des alertes' });
    }
};

// Récupérer toutes les données du dashboard en une seule requête
const getFullDashboard = async (req, res) => {
    const userId = req.userId;

    try {
        // Exécuter toutes les requêtes en parallèle
        const [lots, stock, vaccins] = await Promise.all([
            db.query('SELECT * FROM lots WHERE user_id = ?', [userId]),
            db.query('SELECT * FROM stock_aliment WHERE user_id = ?', [userId]),
            db.query(
                `SELECT v.* FROM vaccinations v 
                 JOIN lots l ON v.lot_id = l.id 
                 WHERE l.user_id = ? AND v.statut = 'programme' 
                 AND v.date_programmee >= CURDATE()`,
                [userId]
            )
        ]);

        const lotsList = lots[0];
        const stockList = stock[0];
        const vaccinsList = vaccins[0];

        // 1. Lots actifs
        const lotsActifs = lotsList.filter(lot => lot.statut === 'actif').length;

        // 2. Total volailles
        let totalVolailles = 0;
        for (const lot of lotsList) {
            if (lot.statut === 'actif') {
                const [morts] = await db.query(
                    'SELECT SUM(mortalite_jour) as total_morts FROM suivi_quotidien WHERE lot_id = ?',
                    [lot.id]
                );
                const [ventes] = await db.query(
                    'SELECT SUM(nombre_vendu) as total_vendus FROM ventes WHERE lot_id = ?',
                    [lot.id]
                );
                const totalMorts = morts[0].total_morts || 0;
                const totalVendus = ventes[0].total_vendus || 0;
                const restant = lot.nombre_initial - totalMorts - totalVendus;
                if (restant > 0) totalVolailles += restant;
            }
        }

        // 3. Alertes stock
        let alertesStock = 0;
        for (const item of stockList) {
            if (item.quantite <= item.seuil_alerte) alertesStock++;
        }

        // 4. Vaccins programmés
        const vaccinsProgrammes = vaccinsList.length;

        // 5. Lots récents
        const lotsRecents = lotsList.slice(0, 5);
        for (let lot of lotsRecents) {
            const [morts] = await db.query(
                'SELECT SUM(mortalite_jour) as total_morts FROM suivi_quotidien WHERE lot_id = ?',
                [lot.id]
            );
            const totalMorts = morts[0].total_morts || 0;
            lot.taux_mortalite = ((totalMorts / lot.nombre_initial) * 100).toFixed(2);
            
            const arrivee = new Date(lot.date_arrivee);
            const aujourdhui = new Date();
            const diffTime = Math.abs(aujourdhui - arrivee);
            lot.age = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // 6. Alertes détaillées
        const alertesStockDetail = stockList.filter(item => item.quantite <= item.seuil_alerte).map(item => ({
            ...item,
            alerte: true,
            message_alerte: "ATTENTION : Stock faible"
        }));

        const aujourdhui = new Date();
        const alertesVaccinsDetail = vaccinsList.filter(v => {
            const dateProgrammee = new Date(v.date_programmee);
            const diffJours = Math.ceil((dateProgrammee - aujourdhui) / (1000 * 60 * 60 * 24));
            return diffJours <= 3 && diffJours >= 0;
        }).map(v => {
            const dateProgrammee = new Date(v.date_programmee);
            const diffJours = Math.ceil((dateProgrammee - aujourdhui) / (1000 * 60 * 60 * 24));
            return {
                ...v,
                message: `Vaccin ${v.type_vaccin} dans ${diffJours} jour${diffJours > 1 ? 's' : ''}`
            };
        });

        res.json({
            resume: {
                lots_actifs: lotsActifs,
                total_volailles: totalVolailles,
                alertes_stock: alertesStock,
                vaccins_programmes: vaccinsProgrammes
            },
            lotsRecents,
            alertesStock: alertesStockDetail,
            alertesVaccins: alertesVaccinsDetail
        });

    } catch (error) {
        console.error('Erreur dashboard complet:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
};

module.exports = { 
    getDashboardData, 
    getRecentLots, 
    getAlertes,
    getFullDashboard
};