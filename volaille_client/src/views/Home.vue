<template>
  <div class="home-container">
    <!-- Section Hero -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <div class="logo-animation">
            <span class="chicken-icon">🐔</span>
            <span class="chicken-icon">🐓</span>
            <span class="chicken-icon">🥚</span>
          </div>
          <h1>VOLAILLE <span class="highlight">CONNECT</span></h1>
          <p class="slogan">Simplifiez la gestion de votre ferme avicole</p>
          <p class="description">
            L'application web qui remplace votre cahier papier par un outil numérique simple, 
            accessible et hors-ligne.
          </p>
          <div class="buttons">
            <router-link to="/register" class="btn btn-primary">
              <span>🚀</span> Commencer gratuitement
            </router-link>
            <router-link to="/login" class="btn btn-secondary">
              <span>🔑</span> Se connecter
            </router-link>
          </div>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number">100%</div>
            <div class="stat-label">Malagasy</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Disponible</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">📱</div>
            <div class="stat-label">Hors-ligne</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Problèmes -->
    <div class="problems-section">
      <div class="container">
        <h2>Les défis des éleveurs</h2>
        <p class="section-subtitle">Nous résolvons vos problèmes quotidiens</p>
        <div class="problems-grid">
          <div class="problem-card">
            <div class="problem-icon">📓</div>
            <h3>Perte de données</h3>
            <p>Cahiers perdus, mouillés ou détruits</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">🧮</div>
            <h3>Calculs erronés</h3>
            <p>Erreurs dans les calculs manuels</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">🔍</div>
            <h3>Difficulté de recherche</h3>
            <p>Retrouver une information prend du temps</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">💊</div>
            <h3>Absence de rappels</h3>
            <p>Dates de vaccination souvent oubliées</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">📦</div>
            <h3>Mauvaise gestion des stocks</h3>
            <p>Ruptures fréquentes d'aliments</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">📊</div>
            <h3>Manque de vision globale</h3>
            <p>Difficulté à évaluer la rentabilité</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Solutions -->
    <div class="solutions-section">
      <div class="container">
        <h2>Ce que nous vous offrons</h2>
        <p class="section-subtitle">Des fonctionnalités puissantes et simples</p>
        <div class="solutions-grid">
          <div class="solution-card">
            <div class="solution-icon">📝</div>
            <h3>Gestion des lots</h3>
            <p>Enregistrez et suivez tous vos lots de volailles</p>
            <ul>
              <li>✓ Nom, race, fournisseur</li>
              <li>✓ Nombre initial de sujets</li>
              <li>✓ Date d'arrivée</li>
            </ul>
          </div>
          <div class="solution-card">
            <div class="solution-icon">📈</div>
            <h3>Suivi quotidien</h3>
            <p>Enregistrez les données importantes chaque jour</p>
            <ul>
              <li>✓ Température</li>
              <li>✓ Consommation alimentaire</li>
              <li>✓ Mortalité journalière</li>
            </ul>
          </div>
          <div class="solution-card">
            <div class="solution-icon">💉</div>
            <h3>Programme vaccinal</h3>
            <p>Ne manquez plus jamais un vaccin</p>
            <ul>
              <li>✓ Planification des vaccins</li>
              <li>✓ Rappels automatiques</li>
              <li>✓ Historique des vaccinations</li>
            </ul>
          </div>
          <div class="solution-card">
            <div class="solution-icon">📦</div>
            <h3>Gestion des stocks</h3>
            <p>Maîtrisez vos stocks d'aliments</p>
            <ul>
              <li>✓ Suivi des entrées/sorties</li>
              <li>✓ Alertes stock faible</li>
              <li>✓ Seuils personnalisables</li>
            </ul>
          </div>
          <div class="solution-card">
            <div class="solution-icon">💰</div>
            <h3>Ventes et rentabilité</h3>
            <p>Suivez vos performances financières</p>
            <ul>
              <li>✓ Enregistrement des ventes</li>
              <li>✓ Calcul automatique CA</li>
              <li>✓ Statistiques mensuelles</li>
            </ul>
          </div>
          <div class="solution-card">
            <div class="solution-icon">📊</div>
            <h3>Tableau de bord</h3>
            <p>Une vision globale de votre ferme</p>
            <ul>
              <li>✓ Indicateurs clés</li>
              <li>✓ Graphiques dynamiques</li>
              <li>✓ Alertes en temps réel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Algorithmes -->
    <div class="algorithms-section">
      <div class="container">
        <h2>Des algorithmes intelligents</h2>
        <p class="section-subtitle">Des calculs automatiques pour vous simplifier la vie</p>
        <div class="algorithms-grid">
          <div class="algo-card">
            <div class="algo-icon">📊</div>
            <h3>Taux de mortalité</h3>
            <code>(morts / total) × 100</code>
            <p>Détectez rapidement les problèmes sanitaires</p>
          </div>
          <div class="algo-card">
            <div class="algo-icon">⚠️</div>
            <h3>Alertes stock</h3>
            <code>stock ≤ seuil → ALERTE</code>
            <p>Évitez les ruptures d'aliments</p>
          </div>
          <div class="algo-card">
            <div class="algo-icon">🔍</div>
            <h3>Recherche intelligente</h3>
            <code>Recherche par nom/race/fournisseur</code>
            <p>Trouvez vos lots en un clin d'œil</p>
          </div>
          <div class="algo-card">
            <div class="algo-icon">📅</div>
            <h3>Calcul de l'âge</h3>
            <code>aujourd'hui - date_arrivée</code>
            <p>Connaissez l'âge exact de vos volailles</p>
          </div>
          <div class="algo-card">
            <div class="algo-icon">💉</div>
            <h3>Rappels vaccins</h3>
            <code>J-3 avant vaccination → NOTIFICATION</code>
            <p>Ne manquez plus aucun vaccin</p>
          </div>
          <div class="algo-card">
            <div class="algo-icon">📈</div>
            <h3>Indice de consommation</h3>
            <code>aliment_consommé / poids_produit</code>
            <p>Évaluez l'efficacité alimentaire</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Pourquoi nous -->
    <div class="why-section">
      <div class="container">
        <h2>Pourquoi choisir VOLAILLE CONNECT ?</h2>
        <div class="why-grid">
          <div class="why-card">
            <div class="why-icon">🌍</div>
            <h3>100% Malgache</h3>
            <p>Application entièrement en langue malgache, adaptée aux éleveurs locaux</p>
          </div>
          <div class="why-card">
            <div class="why-icon">📴</div>
            <h3>Fonctionne hors-ligne</h3>
            <p>Accédez à vos données même sans connexion internet</p>
          </div>
          <div class="why-card">
            <div class="why-icon">🔒</div>
            <h3>Données sécurisées</h3>
            <p>Vos données sont stockées localement sur votre appareil</p>
          </div>
          <div class="why-card">
            <div class="why-icon">🎯</div>
            <h3>Simple et intuitif</h3>
            <p>Une interface conçue pour être utilisée par tous</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section CTA -->
    <div class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Prêt à digitaliser votre ferme ?</h2>
          <p>Rejoignez des centaines d'éleveurs qui ont déjà adopté VOLAILLE CONNECT</p>
          <router-link to="/register" class="btn-cta">
            Créer un compte gratuitement
            <span>→</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>🐔 VOLAILLE CONNECT</h3>
            <p>Système de Gestion de Ferme Avicole</p>
          </div>
          <div class="footer-links">
            <div class="footer-section">
              <h4>Liens rapides</h4>
              <router-link to="/">Accueil</router-link>
              <router-link to="/login">Connexion</router-link>
              <router-link to="/register">Inscription</router-link>
            </div>
            <div class="footer-section">
              <h4>Contact</h4>
              <p>📧 support@volailleconnect.com</p>
              <p>📞 +261 34 00 000 00</p>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 VOLAILLE CONNECT - Projet SIO2 | ANDRIANINDRINA Herivelo Anissa - SE20240336</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" fill-opacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
  background-size: cover;
  opacity: 0.3;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-text {
  text-align: center;
  color: white;
}

.logo-animation {
  margin-bottom: 30px;
}

.chicken-icon {
  font-size: 3rem;
  display: inline-block;
  margin: 0 10px;
  animation: bounce 2s infinite;
}

.chicken-icon:nth-child(2) {
  animation-delay: 0.2s;
}

.chicken-icon:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 20px;
}

.highlight {
  color: #f39c12;
}

.slogan {
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 300;
}

.description {
  font-size: 1.1rem;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 60px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
}

.btn-primary {
  background: #27ae60;
  color: white;
  box-shadow: 0 4px 15px rgba(39,174,96,0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(39,174,96,0.4);
}

.btn-secondary {
  background: rgba(255,255,255,0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-3px);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 50px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #f39c12;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 5px;
}

/* Sections communes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #2c3e50;
}

.section-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 50px;
  font-size: 1.1rem;
}

/* Problems Section */
.problems-section {
  padding: 80px 0;
  background: #f8f9fa;
}

.problems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.problem-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.problem-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.problem-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.problem-card h3 {
  color: #e74c3c;
  margin-bottom: 10px;
}

.problem-card p {
  color: #666;
}

/* Solutions Section */
.solutions-section {
  padding: 80px 0;
  background: white;
}

.solutions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.solution-card {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 15px;
  transition: all 0.3s;
  border: 1px solid #e0e0e0;
}

.solution-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border-color: #27ae60;
}

.solution-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.solution-card h3 {
  color: #27ae60;
  margin-bottom: 15px;
}

.solution-card p {
  color: #666;
  margin-bottom: 15px;
}

.solution-card ul {
  list-style: none;
  padding: 0;
}

.solution-card li {
  padding: 5px 0;
  color: #888;
  font-size: 0.9rem;
}

/* Algorithms Section */
.algorithms-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.algorithms-section h2 {
  color: white;
}

.algorithms-section .section-subtitle {
  color: rgba(255,255,255,0.9);
}

.algorithms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.algo-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  color: white;
  transition: all 0.3s;
}

.algo-card:hover {
  transform: translateY(-5px);
  background: rgba(255,255,255,0.2);
}

.algo-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.algo-card h3 {
  margin-bottom: 15px;
}

.algo-card code {
  display: inline-block;
  background: rgba(0,0,0,0.3);
  padding: 8px 12px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
  margin: 15px 0;
}

.algo-card p {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Why Section */
.why-section {
  padding: 80px 0;
  background: white;
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.why-card {
  text-align: center;
  padding: 30px;
  border-radius: 15px;
  transition: all 0.3s;
}

.why-card:hover {
  transform: translateY(-5px);
}

.why-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.why-card h3 {
  color: #27ae60;
  margin-bottom: 10px;
}

.why-card p {
  color: #666;
}

/* CTA Section */
.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #27ae60 0%, #2c3e50 100%);
  text-align: center;
}

.cta-content h2 {
  color: white;
  margin-bottom: 20px;
}

.cta-content p {
  color: rgba(255,255,255,0.9);
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: white;
  color: #27ae60;
  padding: 15px 40px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.btn-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

/* Footer */
.footer {
  background: #2c3e50;
  color: white;
  padding: 50px 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-bottom: 40px;
}

.footer-brand h3 {
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.footer-brand p {
  opacity: 0.8;
}

.footer-links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.footer-section h4 {
  margin-bottom: 15px;
  color: #27ae60;
}

.footer-section a {
  display: block;
  color: white;
  text-decoration: none;
  margin-bottom: 10px;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.footer-section a:hover {
  opacity: 1;
}

.footer-section p {
  margin-bottom: 5px;
  opacity: 0.8;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
  opacity: 0.7;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  .buttons {
    flex-direction: column;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>