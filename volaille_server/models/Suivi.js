const db = require('../config/database');

class Suivi {
    // Ajouter un suivi quotidien
    static async create(suiviData) {
        const { lot_id, date_suivi, temperature, consommation_aliment, mortalite_jour, observations } = suiviData;
        const [result] = await db.query(
            `INSERT INTO suivi_quotidien 
             (lot_id, date_suivi, temperature, consommation_aliment, mortalite_jour, observations) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [lot_id, date_suivi, temperature, consommation_aliment, mortalite_jour, observations]
        );
        return result.insertId;
    }

    // Récupérer les suivis d'un lot
    static async findByLotId(lot_id, userId = null) {
        let query = `
            SELECT s.* 
            FROM suivi_quotidien s
            JOIN lots l ON s.lot_id = l.id
            WHERE s.lot_id = ?
        `;
        const params = [lot_id];
        
        if (userId) {
            query += ' AND l.user_id = ?';
            params.push(userId);
        }
        
        query += ' ORDER BY s.date_suivi DESC';
        
        const [suivis] = await db.query(query, params);
        return suivis;
    }

    // Mettre à jour un suivi
    static async update(id, suiviData) {
        const { temperature, consommation_aliment, mortalite_jour, observations } = suiviData;
        const [result] = await db.query(
            'UPDATE suivi_quotidien SET temperature=?, consommation_aliment=?, mortalite_jour=?, observations=? WHERE id=?',
            [temperature, consommation_aliment, mortalite_jour, observations, id]
        );
        return result.affectedRows > 0;
    }

    // Vérifier si un suivi existe pour une date
    static async existsForDate(lot_id, date_suivi) {
        const [rows] = await db.query(
            'SELECT id FROM suivi_quotidien WHERE lot_id = ? AND date_suivi = ?',
            [lot_id, date_suivi]
        );
        return rows.length > 0;
    }

    // Obtenir les statistiques d'un lot
    static async getStatsByLotId(lot_id) {
        const [stats] = await db.query(
            `SELECT 
                SUM(mortalite_jour) as total_morts,
                AVG(temperature) as temperature_moyenne,
                SUM(consommation_aliment) as consommation_totale,
                COUNT(*) as nombre_jours
             FROM suivi_quotidien 
             WHERE lot_id = ?`,
            [lot_id]
        );
        return stats[0];
    }
}

module.exports = Suivi;