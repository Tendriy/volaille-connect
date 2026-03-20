const db = require('../config/database');
const { mettreAJourStock } = require('../utils/algorithms');

// Ajouter suivi quotidien
const addSuivi = async (req, res) => {
    const { lot_id, date_suivi, temperature, consommation_aliment, mortalite_jour, observations } = req.body;
    const userId = req.userId;

    try {
        // Vérifier que le lot appartient à l'utilisateur
        const [lots] = await db.query(
            'SELECT * FROM lots WHERE id = ? AND user_id = ?',
            [lot_id, userId]
        );

        if (lots.length === 0) {
            return res.status(403).json({ error: 'Lot non autorisé' });
        }

        // Insérer le suivi
        const [result] = await db.query(
            `INSERT INTO suivi_quotidien 
             (lot_id, date_suivi, temperature, consommation_aliment, mortalite_jour, observations) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [lot_id, date_suivi, temperature, consommation_aliment, mortalite_jour, observations]
        );

        // Mettre à jour le stock automatiquement (Algorithme 11.10)
        if (consommation_aliment && consommation_aliment > 0) {
            const [stock] = await db.query(
                'SELECT * FROM stock_aliment WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
                [userId]
            );
            
            if (stock.length > 0) {
                const nouveauStock = mettreAJourStock(stock[0].quantite, consommation_aliment);
                await db.query(
                    'UPDATE stock_aliment SET quantite = ? WHERE id = ?',
                    [nouveauStock, stock[0].id]
                );
            }
        }

        res.status(201).json({ message: 'Suivi ajouté avec succès', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du suivi' });
    }
};

// Historique suivi d'un lot
const getSuiviByLot = async (req, res) => {
    const { lot_id } = req.params;
    const userId = req.userId;

    try {
        // Vérifier que le lot appartient à l'utilisateur
        const [lots] = await db.query(
            'SELECT * FROM lots WHERE id = ? AND user_id = ?',
            [lot_id, userId]
        );

        if (lots.length === 0) {
            return res.status(403).json({ error: 'Lot non autorisé' });
        }

        const [suivis] = await db.query(
            'SELECT * FROM suivi_quotidien WHERE lot_id = ? ORDER BY date_suivi DESC',
            [lot_id]
        );

        res.json(suivis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération du suivi' });
    }
};

// Modifier un suivi
const updateSuivi = async (req, res) => {
    const { id } = req.params;
    const { temperature, consommation_aliment, mortalite_jour, observations } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE suivi_quotidien SET temperature=?, consommation_aliment=?, mortalite_jour=?, observations=? WHERE id=?',
            [temperature, consommation_aliment, mortalite_jour, observations, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Suivi non trouvé' });
        }

        res.json({ message: 'Suivi modifié avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la modification du suivi' });
    }
};

module.exports = { addSuivi, getSuiviByLot, updateSuivi };