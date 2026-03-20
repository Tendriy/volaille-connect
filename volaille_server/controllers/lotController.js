const db = require('../config/database');
const { calculTauxMortalite, calculerAge, rechercherLots } = require('../utils/algorithms');

// Ajouter un lot
const addLot = async (req, res) => {
    const { nom_lot, race, fournisseur, nombre_initial, date_arrivee } = req.body;
    const userId = req.userId;

    try {
        const [result] = await db.query(
            'INSERT INTO lots (user_id, nom_lot, race, fournisseur, nombre_initial, date_arrivee) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, nom_lot, race, fournisseur, nombre_initial, date_arrivee]
        );

        res.status(201).json({ 
            message: 'Lot ajouté avec succès',
            id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du lot' });
    }
};

// Lister tous les lots
const getAllLots = async (req, res) => {
    const userId = req.userId;

    try {
        const [lots] = await db.query(
            'SELECT * FROM lots WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        // Ajouter les calculs pour chaque lot
        for (let lot of lots) {
            // Calculer le total des morts
            const [morts] = await db.query(
                'SELECT SUM(mortalite_jour) as total_morts FROM suivi_quotidien WHERE lot_id = ?',
                [lot.id]
            );
            const totalMorts = morts[0].total_morts || 0;
            lot.taux_mortalite = calculTauxMortalite(lot.nombre_initial, totalMorts);
            lot.age = calculerAge(lot.date_arrivee);
        }

        res.json(lots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des lots' });
    }
};

// Détail d'un lot
const getLotById = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const [lots] = await db.query(
            'SELECT * FROM lots WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (lots.length === 0) {
            return res.status(404).json({ error: 'Lot non trouvé' });
        }

        const lot = lots[0];
        
        // Calculer le total des morts
        const [morts] = await db.query(
            'SELECT SUM(mortalite_jour) as total_morts FROM suivi_quotidien WHERE lot_id = ?',
            [id]
        );
        const totalMorts = morts[0].total_morts || 0;
        lot.taux_mortalite = calculTauxMortalite(lot.nombre_initial, totalMorts);
        lot.age = calculerAge(lot.date_arrivee);

        res.json(lot);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération du lot' });
    }
};

// Modifier un lot
const updateLot = async (req, res) => {
    const { id } = req.params;
    const { nom_lot, race, fournisseur, nombre_initial, statut } = req.body;
    const userId = req.userId;

    try {
        const [result] = await db.query(
            'UPDATE lots SET nom_lot=?, race=?, fournisseur=?, nombre_initial=?, statut=? WHERE id=? AND user_id=?',
            [nom_lot, race, fournisseur, nombre_initial, statut, id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Lot non trouvé' });
        }

        res.json({ message: 'Lot modifié avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la modification du lot' });
    }
};

// Supprimer un lot
const deleteLot = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const [result] = await db.query(
            'DELETE FROM lots WHERE id = ? AND user_id = ?',
            [id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Lot non trouvé' });
        }

        res.json({ message: 'Lot supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la suppression du lot' });
    }
};

// Clôturer un lot
const cloturerLot = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const [result] = await db.query(
            'UPDATE lots SET statut="cloture" WHERE id=? AND user_id=?',
            [id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Lot non trouvé' });
        }

        res.json({ message: 'Lot clôturé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la clôture du lot' });
    }
};

// Rechercher des lots (Algorithme 11.3)
const searchLots = async (req, res) => {
    const { q } = req.query;
    const userId = req.userId;

    try {
        const [lots] = await db.query(
            'SELECT * FROM lots WHERE user_id = ?',
            [userId]
        );

        const resultats = rechercherLots(lots, q);
        res.json(resultats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la recherche' });
    }
};

module.exports = {
    addLot,
    getAllLots,
    getLotById,
    updateLot,
    deleteLot,
    cloturerLot,
    searchLots
};