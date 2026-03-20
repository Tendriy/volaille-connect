const db = require('../config/database');
const { calculVentesMensuelles } = require('../utils/algorithms');

// Enregistrer une vente
const addVente = async (req, res) => {
    const { lot_id, nombre_vendu, prix_unitaire, date_vente, acheteur } = req.body;
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

        const [result] = await db.query(
            'INSERT INTO ventes (lot_id, nombre_vendu, prix_unitaire, date_vente, acheteur) VALUES (?, ?, ?, ?, ?)',
            [lot_id, nombre_vendu, prix_unitaire, date_vente, acheteur]
        );

        res.status(201).json({ message: 'Vente enregistrée avec succès', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la vente' });
    }
};

// Historique des ventes
const getAllVentes = async (req, res) => {
    const userId = req.userId;

    try {
        const [ventes] = await db.query(
            `SELECT v.*, l.nom_lot 
             FROM ventes v 
             JOIN lots l ON v.lot_id = l.id 
             WHERE l.user_id = ?
             ORDER BY v.date_vente DESC`,
            [userId]
        );

        // Calculer chiffre d'affaires total
        const caTotal = ventes.reduce((total, vente) => {
            return total + (vente.nombre_vendu * vente.prix_unitaire);
        }, 0);

        // Calculer ventes mensuelles (Algorithme 11.6)
        const ventesMensuelles = calculVentesMensuelles(ventes);

        res.json({
            ventes,
            chiffre_affaires_total: caTotal,
            ventes_mensuelles: ventesMensuelles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des ventes' });
    }
};

module.exports = { addVente, getAllVentes };