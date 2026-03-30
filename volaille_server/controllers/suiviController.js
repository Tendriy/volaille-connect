const db = require('../config/database');

// Ajouter suivi quotidien
const addSuivi = async (req, res) => {
    const { lot_id, date_suivi, temperature, consommation_aliment, consommations, mortalite_jour, observations } = req.body;
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

        // Traiter les consommations multiples
        let consommationsData = null;
        let totalConsommation = consommation_aliment || 0;
        
        if (consommations) {
            consommationsData = consommations;
            const consommationsArray = JSON.parse(consommations);
            
            // Mettre à jour chaque stock
            for (let item of consommationsArray) {
                if (!item.type_aliment || !item.quantite || item.quantite <= 0) continue;
                
                // Trouver le stock correspondant
                const [stockItems] = await db.query(
                    'SELECT * FROM stock_aliment WHERE user_id = ? AND type_aliment = ? ORDER BY created_at DESC LIMIT 1',
                    [userId, item.type_aliment]
                );
                
                if (stockItems.length === 0) {
                    return res.status(400).json({ error: `Aucun stock trouvé pour "${item.type_aliment}"` });
                }
                
                const stock = stockItems[0];
                
                // Vérifier si le stock est suffisant
                if (stock.quantite < item.quantite) {
                    return res.status(400).json({ 
                        error: `Stock insuffisant pour "${item.type_aliment}". Il reste ${stock.quantite} ${stock.unite}.` 
                    });
                }
                
                // Mettre à jour le stock
                const nouveauStock = stock.quantite - item.quantite;
                await db.query(
                    'UPDATE stock_aliment SET quantite = ? WHERE id = ?',
                    [nouveauStock, stock.id]
                );
            }
        }

        // Insérer le suivi
        const [result] = await db.query(
            `INSERT INTO suivi_quotidien 
             (lot_id, date_suivi, temperature, consommation_aliment, consommations, mortalite_jour, observations) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [lot_id, date_suivi, temperature, totalConsommation, consommationsData, mortalite_jour, observations]
        );

        res.status(201).json({ 
            message: 'Suivi ajouté avec succès', 
            id: result.insertId 
        });
    } catch (error) {
        console.error('Erreur addSuivi:', error);
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

        // Ajouter le total des consommations pour affichage
        for (let suivi of suivis) {
            if (suivi.consommations) {
                try {
                    const consos = JSON.parse(suivi.consommations);
                    suivi.total_consommation = consos.reduce((sum, c) => sum + (parseFloat(c.quantite) || 0), 0);
                } catch(e) {
                    suivi.total_consommation = suivi.consommation_aliment || 0;
                }
            }
        }

        res.json(suivis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération du suivi' });
    }
};

// Modifier un suivi
const updateSuivi = async (req, res) => {
    const { id } = req.params;
    const { temperature, consommation_aliment, consommations, mortalite_jour, observations } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE suivi_quotidien SET temperature=?, consommation_aliment=?, consommations=?, mortalite_jour=?, observations=? WHERE id=?',
            [temperature, consommation_aliment, consommations, mortalite_jour, observations, id]
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