// Algorithme 1: Calcul du taux de mortalité
function calculTauxMortalite(nombreInitial, totalMorts) {
    if (!nombreInitial || nombreInitial === 0) return 0;
    return ((totalMorts / nombreInitial) * 100).toFixed(2);
}

// Algorithme 2: Vérification du stock
function verifierStock(quantite, seuil) {
    if (quantite <= seuil) {
        return { alerte: true, message: "ATTENTION : Stock faible" };
    }
    return { alerte: false, message: "Stock suffisant" };
}

// Algorithme 3: Calcul de l'âge des volailles
function calculerAge(dateArrivee) {
    const arrivee = new Date(dateArrivee);
    const aujourdhui = new Date();
    const diffTime = Math.abs(aujourdhui - arrivee);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Algorithme 4: Calcul de l'indice de consommation
function calculIndiceConsommation(alimentConsomme, poidsProduit) {
    if (!poidsProduit || poidsProduit === 0) return 0;
    return (alimentConsomme / poidsProduit).toFixed(2);
}

// Algorithme 5: Recherche de lots
function rechercherLots(lots, motCle) {
    return lots.filter(lot => {
        return lot.nom_lot.toLowerCase().includes(motCle.toLowerCase()) ||
               (lot.race && lot.race.toLowerCase().includes(motCle.toLowerCase())) ||
               (lot.fournisseur && lot.fournisseur.toLowerCase().includes(motCle.toLowerCase()));
    });
}

// Algorithme 6: Calcul des ventes mensuelles
function calculVentesMensuelles(ventes) {
    const ventesParMois = {};
    ventes.forEach(vente => {
        const date = new Date(vente.date_vente);
        const mois = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!ventesParMois[mois]) {
            ventesParMois[mois] = 0;
        }
        ventesParMois[mois] += vente.nombre_vendu * vente.prix_unitaire;
    });
    return ventesParMois;
}

// Algorithme 7: Génération d'alertes vaccinales
function genererAlertesVaccins(vaccins, joursAlerte = 3) {
    const aujourdhui = new Date();
    return vaccins.filter(vaccin => {
        const dateProgrammee = new Date(vaccin.date_programmee);
        const diffJours = Math.ceil((dateProgrammee - aujourdhui) / (1000 * 60 * 60 * 24));
        return diffJours <= joursAlerte && diffJours >= 0;
    }).map(vaccin => ({
        ...vaccin,
        message: `Vaccin ${vaccin.type_vaccin} dans ${Math.ceil((new Date(vaccin.date_programmee) - new Date())/(1000*60*60*24))} jours`
    }));
}

// Algorithme 8: Mise à jour du stock après consommation
function mettreAJourStock(stockActuel, consommation) {
    return stockActuel - consommation;
}

module.exports = {
    calculTauxMortalite,
    verifierStock,
    calculerAge,
    calculIndiceConsommation,
    rechercherLots,
    calculVentesMensuelles,
    genererAlertesVaccins,
    mettreAJourStock
};