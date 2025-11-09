/**
 * Modal d'aide à l'utilisation de la calculatrice TI-83 Plus
 */

import { useState } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'graph' | 'advanced' | 'pwa'>('basic');

  if (!isOpen) return null;

  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <h2>📖 Guide d'utilisation - TI-83 Plus</h2>
          <button className="help-close" onClick={onClose}>✕</button>
        </div>

        <div className="help-tabs">
          <button
            className={`help-tab ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Fonctions de base
          </button>
          <button
            className={`help-tab ${activeTab === 'graph' ? 'active' : ''}`}
            onClick={() => setActiveTab('graph')}
          >
            Graphiques
          </button>
          <button
            className={`help-tab ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            Fonctions avancées
          </button>
          <button
            className={`help-tab ${activeTab === 'pwa' ? 'active' : ''}`}
            onClick={() => setActiveTab('pwa')}
          >
            📱 Installation
          </button>
        </div>

        <div className="help-content">
          {activeTab === 'basic' && (
            <div className="help-section">
              <h3>🔢 Calculs de base</h3>
              <ul>
                <li><strong>Chiffres et opérateurs</strong> : Utilisez le clavier numérique et les touches +, −, ×, ÷</li>
                <li><strong>Point décimal (.)</strong> : Touche dédiée pour les nombres décimaux (ex: 9.45)</li>
                <li><strong>Virgule (,)</strong> : 2ND + 7 pour séparer les arguments (ex: max(5,3))</li>
                <li><strong>ENTER</strong> : Valider un calcul</li>
                <li><strong>DEL</strong> : Effacer le dernier caractère</li>
                <li><strong>CLEAR</strong> : Effacer tout l'écran</li>
                <li><strong>(−)</strong> : Signe négatif</li>
              </ul>

              <h3>🎯 Touches spéciales</h3>
              <ul>
                <li><strong>2ND</strong> : Active les fonctions secondaires (en jaune)</li>
                <li><strong>ALPHA</strong> : Active les lettres (en vert)</li>
                <li><strong>MODE</strong> : Choisir entre degrés/radians, float/fixed</li>
                <li><strong>2ND + MODE</strong> : QUIT - Fermer les éditeurs</li>
              </ul>

              <h3>📐 Fonctions mathématiques</h3>
              <ul>
                <li><strong>SIN, COS, TAN</strong> : Fonctions trigonométriques</li>
                <li><strong>2ND + SIN/COS/TAN</strong> : Fonctions inverses (asin, acos, atan)</li>
                <li><strong>√</strong> : Racine carrée</li>
                <li><strong>2ND + √</strong> : x² (au carré)</li>
                <li><strong>^</strong> : Puissance</li>
                <li><strong>2ND + ^</strong> : π (pi)</li>
                <li><strong>LN, LOG</strong> : Logarithmes</li>
                <li><strong>2ND + LN</strong> : e^x</li>
                <li><strong>2ND + LOG</strong> : 10^x</li>
              </ul>
            </div>
          )}

          {activeTab === 'graph' && (
            <div className="help-section">
              <h3>📊 Tracer des graphiques</h3>
              <ol>
                <li><strong>Y=</strong> : Ouvrir l'éditeur de fonctions</li>
                <li>Entrer votre fonction (ex: <code>X^2</code>, <code>sin(X)</code>)</li>
                <li>Appuyer sur <strong>ENTER</strong> pour valider</li>
                <li>Appuyer sur <strong>GRAPH</strong> pour afficher le graphique</li>
              </ol>

              <h3>🔍 Mode TRACE</h3>
              <ul>
                <li><strong>TRACE</strong> : Activer le mode curseur sur le graphique</li>
                <li><strong>← →</strong> : Déplacer le curseur le long de la courbe</li>
                <li><strong>↑ ↓</strong> : Passer d'une fonction à l'autre</li>
                <li>Les coordonnées X,Y s'affichent en haut de l'écran</li>
              </ul>

              <h3>⚙️ Configuration de la fenêtre</h3>
              <ul>
                <li><strong>WINDOW</strong> : Régler Xmin, Xmax, Ymin, Ymax, échelles</li>
                <li><strong>↑ ↓</strong> : Naviguer entre les champs</li>
                <li><strong>ENTER</strong> : Éditer un champ</li>
                <li><strong>CLEAR/QUIT</strong> : Sauvegarder et fermer</li>
              </ul>

              <h3>🔎 Menu ZOOM</h3>
              <ul>
                <li><strong>ZStandard</strong> : Fenêtre standard (-10 à 10)</li>
                <li><strong>ZDecimal</strong> : Coordonnées décimales</li>
                <li><strong>ZTrig</strong> : Optimisé pour les fonctions trigonométriques</li>
                <li><strong>Zoom In/Out</strong> : Zoomer/Dézoomer</li>
              </ul>

              <h3>🧮 Menu CALC (2ND + TRACE)</h3>
              <ul>
                <li><strong>value</strong> : Calculer Y pour un X donné</li>
                <li><strong>zero</strong> : Trouver les zéros (racines)</li>
                <li><strong>minimum/maximum</strong> : Trouver les extrema</li>
                <li><strong>dy/dx</strong> : Calculer la dérivée</li>
                <li><strong>∫f(x)dx</strong> : Calculer l'intégrale</li>
              </ul>

              <h3>📊 TABLE & TBLSET - Affichage Tabulaire</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Visualisez vos fonctions sous forme de tableau de valeurs !
              </p>

              <h4>📋 TABLE (2ND + GRAPH)</h4>
              <ul>
                <li><strong>Affichage</strong> : Tableau avec X, Y1, Y2, ..., Y6</li>
                <li><strong>↑ ↓</strong> : Naviguer verticalement (50 lignes)</li>
                <li><strong>← →</strong> : Naviguer horizontalement entre colonnes</li>
                <li><strong>CLEAR</strong> : Fermer le tableau</li>
              </ul>

              <h4>⚙️ TBLSET (2ND + WINDOW)</h4>
              <ul>
                <li><strong>TblStart</strong> : Valeur de départ (ex: 0)</li>
                <li><strong>ΔTbl</strong> : Incrément entre valeurs (ex: 1)</li>
                <li><strong>Indpnt</strong> : AUTO (automatique) ou ASK</li>
                <li><strong>Depend</strong> : AUTO (automatique) ou ASK</li>
              </ul>

              <div className="help-examples">
                <strong>Exemple - Tableau pour Y1=X²</strong><br/>
                1. <code>Y=</code> → Entrer <code>X^2</code><br/>
                2. <code>2ND + WINDOW</code> → TblStart=0, ΔTbl=1<br/>
                3. <code>2ND + GRAPH</code> → Voir le tableau<br/>
                <br/>
                <strong>Résultat :</strong><br/>
                <code>X=0  Y1=0</code><br/>
                <code>X=1  Y1=1</code><br/>
                <code>X=2  Y1=4</code><br/>
                <code>X=3  Y1=9</code><br/>
              </div>

              <h3>🔄 Modes Graphiques : Parametric & Polar</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Tracez des courbes paramétriques et polaires !
              </p>

              <h4>📐 Mode Parametric (Par)</h4>
              <ul>
                <li><strong>MODE</strong> : Sélectionner "Par"</li>
                <li><strong>Y=</strong> : Entrer X1T= et Y1T=</li>
                <li><strong>WINDOW</strong> : Configurer tMin, tMax, tStep</li>
                <li><strong>GRAPH</strong> : Tracer la courbe</li>
              </ul>

              <div className="help-examples">
                <strong>Exemple - Cercle unitaire :</strong><br/>
                1. <code>MODE</code> → Par<br/>
                2. <code>Y=</code> → X1T=<code>cos(T)</code>, Y1T=<code>sin(T)</code><br/>
                3. <code>WINDOW</code> → tMin=0, tMax=6.28, tStep=0.1<br/>
                4. <code>GRAPH</code> → Cercle affiché !<br/>
                <br/>
                <strong>Autres exemples :</strong><br/>
                <code>X1T=T, Y1T=T^2</code> → Parabole<br/>
                <code>X1T=T*cos(T), Y1T=T*sin(T)</code> → Spirale<br/>
              </div>

              <h4>🌀 Mode Polar (Pol)</h4>
              <ul>
                <li><strong>MODE</strong> : Sélectionner "Pol"</li>
                <li><strong>Y=</strong> : Entrer r1=, r2=, ...</li>
                <li><strong>WINDOW</strong> : Configurer θMin, θMax, θStep</li>
                <li><strong>GRAPH</strong> : Tracer la courbe</li>
              </ul>

              <div className="help-examples">
                <strong>Exemple - Cardioïde :</strong><br/>
                1. <code>MODE</code> → Pol<br/>
                2. <code>Y=</code> → r1=<code>1+cos(θ)</code><br/>
                3. <code>WINDOW</code> → θMin=0, θMax=6.28, θStep=0.1<br/>
                4. <code>GRAPH</code> → Cardioïde affichée !<br/>
                <br/>
                <strong>Autres exemples :</strong><br/>
                <code>r1=2</code> → Cercle de rayon 2<br/>
                <code>r1=θ</code> → Spirale d'Archimède<br/>
                <code>r1=sin(3*θ)</code> → Rose à 3 pétales<br/>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="help-section">
              <h3>📈 Menu STAT (Statistiques)</h3>
              <ul>
                <li><strong>STAT &gt; Edit</strong> : Éditer les listes de données (L1-L6)</li>
                <li><strong>ENTER</strong> : Éditer une valeur</li>
                <li><strong>← →</strong> : Changer de liste</li>
                <li><strong>↑ ↓</strong> : Naviguer dans la liste</li>
                <li><strong>CLEAR</strong> : Fermer l'éditeur</li>
              </ul>

              <h3>📊 STAT PLOT - Graphiques Statistiques</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Accès : <strong>2ND + Y=</strong> (touche STAT PLOT)
              </p>

              <h4>⚙️ Configuration des Plots</h4>
              <ul>
                <li><strong>Plot1, Plot2, Plot3</strong> : 3 plots indépendants</li>
                <li><strong>On/Off</strong> : Activer/désactiver un plot</li>
                <li><strong>Type</strong> : Scatter, xyLine, Histogram, Box Plot</li>
                <li><strong>Xlist/Ylist</strong> : Sélectionner L1-L6</li>
                <li><strong>Mark</strong> : Marqueur (□, +, •)</li>
              </ul>

              <h4>📍 Types de graphiques disponibles</h4>
              <ul>
                <li><strong>Scatter</strong> : Nuage de points avec marqueurs</li>
                <li><strong>xyLine</strong> : Ligne reliant les points</li>
                <li><strong>Histogram</strong> : Histogramme avec bins automatiques</li>
                <li><strong>modBoxPlot</strong> : Boîte à moustaches modifiée</li>
                <li><strong>normBoxPlot</strong> : Boîte à moustaches normale</li>
              </ul>

              <div className="help-examples">
                <strong>Exemple - Nuage de points :</strong><br/>
                1. <code>STAT → Edit</code><br/>
                   L1: <code>1, 2, 3, 4, 5</code><br/>
                   L2: <code>2, 4, 5, 7, 9</code><br/>
                <br/>
                2. <code>2ND + Y=</code> → Plot1<br/>
                   On: <code>ON</code><br/>
                   Type: <code>Scatter</code><br/>
                   Xlist: <code>L1</code><br/>
                   Ylist: <code>L2</code><br/>
                   Mark: <code>□</code><br/>
                <br/>
                3. <code>GRAPH</code> → Scatter plot affiché !<br/>
                <br/>
                <strong>Exemple - Histogramme :</strong><br/>
                1. <code>STAT → Edit</code><br/>
                   L1: <code>10, 15, 12, 18, 20, 14, 16</code><br/>
                <br/>
                2. <code>2ND + Y=</code> → Plot1<br/>
                   On: <code>ON</code><br/>
                   Type: <code>Histogram</code><br/>
                   Xlist: <code>L1</code><br/>
                <br/>
                3. <code>GRAPH</code> → Histogramme affiché !<br/>
              </div>

              <h4>💡 Astuces STAT PLOT</h4>
              <ul>
                <li>Les plots se superposent aux fonctions Y1-Y6</li>
                <li>Utilisez ZOOM → ZoomStat pour ajuster la fenêtre</li>
                <li>Les 3 plots peuvent être actifs simultanément</li>
                <li>Chaque plot peut avoir un marqueur différent</li>
              </ul>

              <h3>🧮 Menu MATH - Navigation Hiérarchique</h3>
              <ul>
                <li><strong>MATH</strong> : Ouvrir le menu avec 38 fonctions en 6 catégories</li>
                <li><strong>↑ ↓</strong> : Naviguer dans les menus</li>
                <li><strong>ENTER</strong> : Entrer dans un sous-menu (▶) ou sélectionner une fonction</li>
                <li><strong>CLEAR</strong> : Revenir au menu parent ou fermer</li>
              </ul>

              <h4>Catégories disponibles :</h4>
              <ul>
                <li><strong>0:Solver...</strong> : Résolveur d'équations f(X)=0 (voir ci-dessous)</li>
                <li><strong>MATH (Principal)</strong> : ³√, logBASE, e^x, 10^x, hypot</li>
                <li><strong>NUM ▶</strong> : abs, round, iPart, fPart, min, max, gcd, lcm, ceil, floor, sign, trunc, mod</li>
                <li><strong>CPX ▶</strong> : conj, real, imag, angle, abs, Rect, Polar</li>
                <li><strong>PRB ▶</strong> : rand, nPr, nCr, !, randInt, randNorm, randBin</li>
                <li><strong>ANGLE ▶</strong> : °→rad, rad→°, →DMS, →Dec</li>
                <li><strong>TRIG ▶</strong> : sinh, cosh, tanh, asinh, acosh, atanh</li>
              </ul>

              <h3>🎯 SOLVER - Résolveur d'Équations (MATH &gt; 0)</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Trouvez les racines (zéros) d'une équation f(X)=0 avec précision numérique !
              </p>

              <h4>📝 Utilisation du Solver</h4>
              <ol>
                <li><strong>MATH</strong> → Sélectionner <strong>0:Solver...</strong></li>
                <li><strong>Équation</strong> : Entrer votre équation (ex: X^2-4)</li>
                <li><strong>Estimation</strong> : Valeur de départ pour la recherche (ex: 1)</li>
                <li><strong>GRAPH</strong> : Lancer la résolution</li>
                <li>Résultat affiché avec 10 décimales de précision</li>
              </ol>

              <h4>⌨️ Navigation dans le Solver</h4>
              <ul>
                <li><strong>↑ ↓</strong> : Naviguer entre les champs (Équation/Estimation)</li>
                <li><strong>ENTER</strong> : Éditer le champ sélectionné / Sortir de l'édition</li>
                <li><strong>DEL</strong> : Effacer le dernier caractère</li>
                <li><strong>GRAPH</strong> : Résoudre l'équation</li>
                <li><strong>CLEAR</strong> : Fermer le Solver</li>
              </ul>

              <h4>🧮 Exemples d'équations</h4>
              <div className="help-examples">
                <strong>Équations polynomiales :</strong><br/>
                <code>X^2-4</code> avec estimation <code>1</code> → X = 2.0000000000<br/>
                <code>X^3-2*X-5</code> avec estimation <code>2</code> → X = 2.0945514815<br/>
                <code>X^4-10</code> avec estimation <code>2</code> → X = 1.7782794100<br/>
                <br/>
                <strong>Équations trigonométriques :</strong><br/>
                <code>sin(X)-0.5</code> avec estimation <code>0.5</code> → X = 0.5235987756 (rad)<br/>
                <code>cos(X)-X</code> avec estimation <code>1</code> → X = 0.7390851332<br/>
                <code>tan(X)-2</code> avec estimation <code>1</code> → X = 1.1071487178<br/>
                <br/>
                <strong>Équations logarithmiques :</strong><br/>
                <code>ln(X)-2</code> avec estimation <code>5</code> → X = 7.3890560989<br/>
                <code>log(X)-1</code> avec estimation <code>5</code> → X = 10.0000000000<br/>
                <br/>
                <strong>Équations complexes :</strong><br/>
                <code>X^3-sin(X)-1</code> avec estimation <code>1</code> → X = 1.2493247076<br/>
                <code>e^X-5*X</code> avec estimation <code>0.5</code> → X = 0.2591711018<br/>
                <code>√(X)-cos(X)</code> avec estimation <code>1</code> → X = 0.6417143708<br/>
              </div>

              <h4>🔬 Méthode numérique</h4>
              <p style={{ fontSize: '0.85em', color: '#666' }}>
                Le Solver utilise la <strong>méthode de Newton-Raphson</strong> avec un fallback
                automatique sur la <strong>méthode de bissection</strong> si nécessaire.
                Précision : 10⁻¹⁰ (10 décimales). Affiche le nombre d'itérations effectuées.
              </p>

              <h4>💡 Conseils pour le Solver</h4>
              <ul>
                <li>Choisissez une estimation proche de la racine attendue</li>
                <li>Pour les équations trigonométriques, vérifiez le mode DEGREE/RADIAN</li>
                <li>Si "Pas de convergence", essayez une autre estimation</li>
                <li>Vous pouvez utiliser toutes les fonctions (sin, cos, ln, √, etc.)</li>
              </ul>

              <h3>💰 FINANCE - Calculs Financiers TVM (APPS)</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Calculateur financier professionnel avec Time Value of Money (TVM) !
              </p>

              <h4>💼 Utilisation du TVM Solver</h4>
              <ol>
                <li><strong>APPS</strong> : Ouvrir le Finance TVM Solver</li>
                <li><strong>↑ ↓</strong> : Naviguer entre les 7 variables TVM</li>
                <li><strong>ENTER</strong> : Éditer une variable / Sortir de l'édition</li>
                <li>Entrer les valeurs connues dans les champs appropriés</li>
                <li>Sélectionner la variable à calculer</li>
                <li><strong>GRAPH</strong> : Calculer la variable sélectionnée</li>
              </ol>

              <h4>📊 Variables TVM</h4>
              <div className="help-examples">
                <strong>N</strong> : Nombre de périodes de paiement<br/>
                <strong>I%</strong> : Taux d'intérêt annuel (en pourcentage)<br/>
                <strong>PV</strong> : Valeur actuelle (Present Value) - montant initial<br/>
                <strong>PMT</strong> : Paiement périodique (Payment)<br/>
                <strong>FV</strong> : Valeur future (Future Value) - montant final<br/>
                <strong>P/Y</strong> : Paiements par an (12 pour mensuel, 1 pour annuel)<br/>
                <strong>C/Y</strong> : Compositions par an (12 pour mensuel, 1 pour annuel)<br/>
              </div>

              <h4>💡 Exemples de calculs financiers</h4>
              <div className="help-examples">
                <strong>Prêt hypothécaire :</strong><br/>
                • PV = 200000 (emprunt 200k€)<br/>
                • I% = 3.5 (taux annuel 3.5%)<br/>
                • N = 240 (20 ans × 12 mois)<br/>
                • P/Y = 12, C/Y = 12<br/>
                → Calculer PMT = -1158.03€ (paiement mensuel)<br/>
                <br/>
                <strong>Épargne retraite :</strong><br/>
                • PMT = -500 (versement mensuel 500€)<br/>
                • I% = 5 (rendement annuel 5%)<br/>
                • N = 300 (25 ans × 12 mois)<br/>
                • PV = 0, P/Y = 12, C/Y = 12<br/>
                → Calculer FV = 295488.06€ (capital à la retraite)<br/>
                <br/>
                <strong>Durée d'un prêt :</strong><br/>
                • PV = 15000 (crédit auto 15k€)<br/>
                • PMT = -350 (mensualité 350€)<br/>
                • I% = 4.2 (taux annuel 4.2%)<br/>
                • FV = 0, P/Y = 12, C/Y = 12<br/>
                → Calculer N = 46.27 mois (≈ 3.9 ans)<br/>
              </div>

              <h4>🔢 Mode de paiement</h4>
              <p style={{ fontSize: '0.85em', color: '#666' }}>
                <strong>END</strong> : Paiements en fin de période (défaut - prêts classiques)<br/>
                <strong>BEGIN</strong> : Paiements en début de période (rentes immédiates)<br/>
                Cliquez sur le bouton END/BEGIN pour basculer entre les modes.
              </p>

              <h4>⚠️ Conventions financières</h4>
              <ul>
                <li>Flux entrants = positifs (ex: dépôts, revenus)</li>
                <li>Flux sortants = négatifs (ex: prêts reçus, paiements effectués)</li>
                <li>PV négatif = argent emprunté ; PV positif = argent investi</li>
                <li>PMT négatif = paiement effectué ; PMT positif = paiement reçu</li>
              </ul>

              <h3>📚 CATALOG - Liste des Fonctions (2ND + 0)</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Accédez rapidement à TOUTES les fonctions mathématiques disponibles !
              </p>

              <h4>📖 Utilisation du Catalog</h4>
              <ul>
                <li><strong>2ND + 0</strong> : Ouvrir le Catalog (100+ fonctions)</li>
                <li><strong>↑ ↓</strong> : Naviguer dans la liste alphabétique</li>
                <li><strong>A-Z</strong> : Taper une lettre pour sauter à cette section</li>
                <li><strong>ENTER</strong> : Insérer la fonction sélectionnée</li>
                <li><strong>CLEAR</strong> : Fermer le Catalog</li>
              </ul>

              <h4>✨ Fonctions disponibles dans le Catalog</h4>
              <div className="help-examples">
                <strong>A-D :</strong> abs, acos, Ans, asin, atan, binomcdf, binompdf, ceil, conj, cos, cosh, cbrt, det...<br/>
                <strong>E-I :</strong> e^x, exp, fPart, floor, gcd, hypot, identity, imag, int, iPart...<br/>
                <strong>L-P :</strong> lcm, ln, log, logBASE, max, min, nCr, nPr, Polar, π...<br/>
                <strong>R-Z :</strong> rand, randInt, real, Rect, round, sign, sin, sinh, sqrt, tan, tanh, trace, trunc...<br/>
              </div>

              <h4>⚡ Recherche rapide</h4>
              <p style={{ fontSize: '0.85em', color: '#666' }}>
                Tapez simplement la première lettre de la fonction que vous cherchez !
                Par exemple, tapez <strong>S</strong> pour sauter directement aux fonctions
                commençant par S (sin, sqrt, sign, etc.).
              </p>

              <h3>📊 DISTR - Distributions Statistiques</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Fonctions de probabilité pour l'analyse statistique avancée
              </p>

              <h4>📈 Distributions continues</h4>
              <div className="help-examples">
                <strong>Normale :</strong><br/>
                • <code>normalcdf(lower, upper, μ, σ)</code> : P(lower ≤ X ≤ upper)<br/>
                • <code>normalpdf(x, μ, σ)</code> : Densité de probabilité en x<br/>
                • <code>invNorm(area, μ, σ)</code> : Quantile (inverse de cdf)<br/>
                <br/>
                <strong>Student (t) :</strong><br/>
                • <code>tcdf(lower, upper, df)</code> : P(lower ≤ T ≤ upper)<br/>
                • <code>tpdf(x, df)</code> : Densité en x<br/>
                <br/>
                <strong>Chi-carré (χ²) :</strong><br/>
                • <code>χ²cdf(lower, upper, df)</code> : P(lower ≤ χ² ≤ upper)<br/>
                • <code>χ²pdf(x, df)</code> : Densité en x<br/>
                <br/>
                <strong>Fisher (F) :</strong><br/>
                • <code>Fcdf(lower, upper, df1, df2)</code> : P(lower ≤ F ≤ upper)<br/>
                • <code>Fpdf(x, df1, df2)</code> : Densité en x<br/>
              </div>

              <h4>🎲 Distributions discrètes</h4>
              <div className="help-examples">
                <strong>Binomiale :</strong><br/>
                • <code>binompdf(n, p, k)</code> : P(X = k)<br/>
                • <code>binomcdf(n, p, k)</code> : P(X ≤ k)<br/>
                <br/>
                <strong>Poisson :</strong><br/>
                • <code>poissonpdf(λ, k)</code> : P(X = k)<br/>
                • <code>poissoncdf(λ, k)</code> : P(X ≤ k)<br/>
                <br/>
                <strong>Géométrique :</strong><br/>
                • <code>geometpdf(p, k)</code> : P(X = k)<br/>
                • <code>geometcdf(p, k)</code> : P(X ≤ k)<br/>
              </div>

              <h4>💡 Exemples d'utilisation</h4>
              <div className="help-examples">
                <code>normalcdf(-1.96, 1.96, 0, 1)</code> → 0.95 (intervalle à 95%)<br/>
                <code>invNorm(0.975, 0, 1)</code> → 1.96 (quantile 97.5%)<br/>
                <code>binomcdf(10, 0.5, 5)</code> → 0.623 (10 lancers, ≤5 succès)<br/>
                <code>tcdf(-2, 2, 9)</code> → 0.926 (t avec 9 degrés de liberté)<br/>
              </div>

              <h3>🔍 TEST & LOGIC - Opérateurs de Comparaison et Logiques</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Opérateurs retournant 1 (vrai) ou 0 (faux)
              </p>

              <h4>⚖️ Opérateurs TEST</h4>
              <div className="help-examples">
                • <code>=</code> : Égalité<br/>
                • <code>≠</code> : Non-égalité<br/>
                • <code>&gt;</code> : Supérieur<br/>
                • <code>≥</code> : Supérieur ou égal<br/>
                • <code>&lt;</code> : Inférieur<br/>
                • <code>≤</code> : Inférieur ou égal<br/>
              </div>

              <h4>🔗 Opérateurs LOGIC</h4>
              <div className="help-examples">
                • <code>and</code> : ET logique (1 si les deux vrais)<br/>
                • <code>or</code> : OU logique (1 si au moins un vrai)<br/>
                • <code>xor</code> : OU exclusif (1 si exactement un vrai)<br/>
                • <code>not(x)</code> : NON logique (1 si x=0, 0 sinon)<br/>
              </div>

              <h4>💡 Exemples</h4>
              <div className="help-examples">
                <code>5 &gt; 3</code> → 1 (vrai)<br/>
                <code>2 = 3</code> → 0 (faux)<br/>
                <code>(5 &gt; 3) and (2 &lt; 4)</code> → 1 (les deux vrais)<br/>
                <code>(1 = 1) or (2 = 3)</code> → 1 (au moins un vrai)<br/>
                <code>not(0)</code> → 1 (NON de faux = vrai)<br/>
              </div>

              <h3>🧠 Menu MEM (Mémoire)</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Accès : <strong>2ND + +</strong> (touche MEM)
              </p>
              <ul>
                <li><strong>Reset</strong> : Réinitialiser toute la mémoire</li>
                <li><strong>Delete</strong> : Supprimer des éléments individuels
                  <ul style={{ marginLeft: '20px', fontSize: '0.9em' }}>
                    <li>Variables : A-Z, θ (stocker avec STO→)</li>
                    <li>Listes : L1-L6 (éditeur STAT)</li>
                    <li>Matrices : A-J (éditeur MATRIX)</li>
                  </ul>
                </li>
                <li><strong>Navigation</strong> :
                  <ul style={{ marginLeft: '20px', fontSize: '0.9em' }}>
                    <li>↑ ↓ : Naviguer dans les options</li>
                    <li>← → : Changer de catégorie (All/Var/List/Matrix)</li>
                    <li>ENTER : Sélectionner pour suppression</li>
                    <li>CLEAR : Fermer</li>
                  </ul>
                </li>
              </ul>

              <h3>📊 Menu MATRIX (Matrices)</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Accès : <strong>2ND + X⁻¹</strong> (touche MATRIX)
              </p>

              <h4>📝 Onglet NAMES - Insérer une matrice</h4>
              <ul>
                <li>Sélectionner une matrice (A-J)</li>
                <li>ENTER pour insérer <code>[A]</code> dans un calcul</li>
                <li>Affiche les dimensions (ex: 3×3)</li>
              </ul>

              <h4>✏️ Onglet EDIT - Éditer une matrice</h4>
              <ol>
                <li>Sélectionner la matrice à éditer</li>
                <li>ENTER pour ouvrir l'éditeur de grille</li>
                <li>← → ↑ ↓ : Naviguer entre les cellules</li>
                <li>ENTER : Commencer l'édition d'une cellule</li>
                <li>Taper la valeur et ENTER pour valider</li>
                <li>Touche <strong>D</strong> : Changer les dimensions (rows/cols)</li>
                <li>CLEAR : Fermer l'éditeur</li>
              </ol>

              <h4>🧮 Onglet MATH - Opérations matricielles</h4>
              <ul>
                <li><strong>det(</strong> : Déterminant - <code>det([A])</code></li>
                <li><strong>T</strong> : Transposée - <code>[A]^T</code></li>
                <li><strong>dim(</strong> : Dimensions - <code>dim([A])</code></li>
                <li><strong>Fill(</strong> : Remplir - <code>Fill(5,[A])</code></li>
                <li><strong>identity(</strong> : Matrice identité - <code>identity(3)</code></li>
                <li><strong>randM(</strong> : Matrice aléatoire - <code>randM(3,3)</code></li>
              </ul>

              <h4>➕ Calculs matriciels</h4>
              <div className="help-examples">
                <strong>Opérations de base :</strong><br/>
                <code>[A] + [B]</code> - Addition<br/>
                <code>[A] - [B]</code> - Soustraction<br/>
                <code>[A] * [B]</code> - Produit matriciel<br/>
                <code>5 * [A]</code> - Multiplication scalaire<br/>
                <code>[A] ^ 2</code> - Puissance (A²)<br/>
                <br/>
                <strong>Fonctions avancées :</strong><br/>
                <code>det([A])</code> - Déterminant<br/>
                <code>[A]^T</code> - Transposée<br/>
                <code>inv([A])</code> - Inverse<br/>
                <code>trace([A])</code> - Trace<br/>
                <br/>
                <strong>Calculs complexes :</strong><br/>
                <code>det([A]*[B])</code> - Déterminant du produit<br/>
                <code>inv([A])*[B]</code> - Résolution A·X=B<br/>
                <code>2*[A] + [B]^T</code> - Calcul combiné<br/>
              </div>

              <h3>🎨 Fonctionnalités supplémentaires</h3>
              <ul>
                <li><strong>Navigation fluide</strong> : Tous les éditeurs fonctionnent avec le clavier virtuel</li>
                <li><strong>Sauvegarde automatique</strong> : Les paramètres sont sauvegardés en fermant avec CLEAR</li>
                <li><strong>Historique</strong> : Les calculs précédents sont affichés en haut de l'écran</li>
                <li><strong>Mode SECOND</strong> : S'éteint automatiquement après utilisation</li>
              </ul>

              <h3>🎓 Exemples de fonctions graphiques</h3>
              <div className="help-examples">
                <code>X^2</code> - Parabole<br/>
                <code>sin(X)</code> - Sinus<br/>
                <code>2*X+3</code> - Droite<br/>
                <code>X^3-3*X</code> - Cubique<br/>
                <code>√(X)</code> - Racine carrée<br/>
                <code>1/X</code> - Hyperbole<br/>
                <code>e^X</code> - Exponentielle (2ND + LN + X)<br/>
                <code>ln(X)</code> - Logarithme naturel<br/>
              </div>

              <h3>🧮 Exemples de calculs mathématiques</h3>
              <div className="help-examples">
                <code>max(5,3)</code> → 5<br/>
                <code>min(2,8,15)</code> → 2<br/>
                <code>abs(-10)</code> → 10<br/>
                <code>gcd(24,18)</code> → 6 (PGCD)<br/>
                <code>lcm(12,18)</code> → 36 (PPCM)<br/>
                <code>nPr(10,3)</code> → 720 (Permutations)<br/>
                <code>nCr(10,5)</code> → 252 (Combinaisons)<br/>
                <code>iPart(3.14)</code> → 3<br/>
                <code>round(3.7)</code> → 4<br/>
                <code>hypot(3,4)</code> → 5<br/>
              </div>

              <h3>🔄 Calculs en Chaîne avec ANS</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Appuyez sur <strong>2ND + (-)</strong> pour insérer le dernier résultat (ANS).
              </p>
              <div className="help-examples">
                <strong>Exemple 1 : Avec ANS</strong><br/>
                <code>5 + 3 = 8</code><br/>
                <code>ANS × 2 = 16</code><br/>
                <code>ANS - 4 = 12</code><br/>
                <br/>
                <strong>Exemple 2 : Opérateurs automatiques</strong><br/>
                <code>8 = 8</code><br/>
                <code>+ 5 → 8 + 5 = 13</code><br/>
                <code>× 2 → 13 × 2 = 26</code><br/>
                <br/>
                <strong>Exemple 3 : Fonctions automatiques</strong><br/>
                <code>144 = 144</code><br/>
                <code>√ → √(144) = 12</code><br/>
                <code>X² → 12^2 = 144</code><br/>
                <code>ln → ln(144) = 4.97...</code><br/>
                <br/>
                <strong>Exemple 4 : Calcul scientifique</strong><br/>
                <code>45 = 45</code><br/>
                <code>sin → sin(45) = 0.85...</code><br/>
                <code>× 10 → 0.85... × 10 = 8.5...</code><br/>
              </div>
              <p style={{ fontSize: '0.85em', color: '#666', marginTop: '10px' }}>
                💡 Astuce : Les fonctions (sin, cos, √, ln, log, X², X⁻¹) et les opérateurs (+, -, ×, ÷)
                s'appliquent automatiquement au résultat précédent après un calcul !
              </p>

              <h3>💡 Astuces</h3>
              <ul>
                <li>Utilisez le mode DEGREE pour les angles en degrés</li>
                <li>Utilisez TRACE après GRAPH pour analyser les courbes</li>
                <li>Les parenthèses sont importantes : <code>sin(X^2)</code> ≠ <code>sin(X)^2</code></li>
                <li>Pour tracer plusieurs fonctions, définissez Y1, Y2, Y3, etc.</li>
              </ul>
            </div>
          )}

          {activeTab === 'pwa' && (
            <div className="help-section">
              <h3>📱 Installation sur Android</h3>
              <p>
                Cette calculatrice est une <strong>Progressive Web App (PWA)</strong> installable
                sur votre téléphone Android comme une vraie application !
              </p>

              <h4>✨ Avantages de l'installation</h4>
              <ul>
                <li><strong>📲 Icône sur l'écran d'accueil</strong> - Comme une app du Play Store</li>
                <li><strong>📴 Fonctionne hors ligne</strong> - Pas besoin d'Internet après installation</li>
                <li><strong>⚡ Chargement instantané</strong> - Cache optimisé</li>
                <li><strong>🔄 Mises à jour automatiques</strong> - Toujours la dernière version</li>
                <li><strong>🚀 Mode plein écran</strong> - Pas de barre d'adresse</li>
                <li><strong>💾 Ultra légère</strong> - Seulement 337 KB</li>
              </ul>

              <h4>🎯 Installation en 3 étapes (Android)</h4>
              <ol>
                <li>
                  <strong>Ouvrez Chrome</strong> sur votre téléphone Android
                </li>
                <li>
                  <strong>Visitez</strong> : www.lhusser.fr/calculatrice
                </li>
                <li>
                  <strong>Menu ⋮</strong> → "Ajouter à l'écran d'accueil"
                </li>
              </ol>

              <p>
                <strong>✨ C'est tout !</strong> L'application apparaîtra sur votre écran d'accueil.
              </p>

              <h4>📱 Utilisation de l'app installée</h4>
              <ul>
                <li>Tapez sur l'icône "TI-83 Plus" pour lancer</li>
                <li>L'app s'ouvre en <strong>mode autonome</strong> (sans barre d'adresse)</li>
                <li>Toutes les fonctions marchent <strong>hors ligne</strong></li>
                <li>Les mises à jour se font <strong>automatiquement</strong></li>
              </ul>

              <h4>🔄 Mise à jour de l'application</h4>
              <p>
                Quand une nouvelle version est disponible :
              </p>
              <ul>
                <li>Un message s'affiche automatiquement</li>
                <li>Tapez sur "Recharger" pour mettre à jour</li>
                <li>Ou attendez, la mise à jour se fera au prochain lancement</li>
              </ul>

              <h4>🗑️ Désinstallation</h4>
              <p>Pour supprimer l'application :</p>
              <ol>
                <li>Maintenez l'icône "TI-83 Plus" sur l'écran d'accueil</li>
                <li>Glissez vers "Désinstaller" ou "Supprimer"</li>
                <li>Confirmez la suppression</li>
              </ol>

              <h4>❓ Problèmes d'installation ?</h4>
              <ul>
                <li><strong>Option non disponible :</strong> Utilisez Chrome (version 80+)</li>
                <li><strong>Icône n'apparaît pas :</strong> Attendez 5-10 secondes après le chargement</li>
                <li><strong>Mode hors ligne ne marche pas :</strong> Ouvrez l'app au moins une fois avec Internet</li>
              </ul>

              <h4>💡 Astuce</h4>
              <p>
                Après installation, vous pouvez utiliser la calculatrice <strong>partout</strong>,
                même en <strong>mode avion</strong> ! Parfait pour les examens ou quand vous n'avez
                pas de réseau.
              </p>

              <h4>📊 Informations techniques</h4>
              <ul>
                <li><strong>Taille</strong> : 337 KB (283 KB compressé)</li>
                <li><strong>Compatibilité</strong> : Chrome Android 80+, Samsung Internet 12+</li>
                <li><strong>Offline</strong> : 13 fichiers en cache local</li>
                <li><strong>Update</strong> : Automatique en arrière-plan</li>
              </ul>

              <h4>🌐 Support iOS</h4>
              <p>
                <strong>Sur iPhone/iPad :</strong> L'installation est possible mais avec Safari.
                Tapez sur le bouton "Partager" puis "Sur l'écran d'accueil".
                Note : Le mode hors ligne peut être limité sur iOS.
              </p>
            </div>
          )}
        </div>

        <div className="help-footer">
          <p style={{ fontSize: '0.85em', marginBottom: '10px', color: '#666' }}>
            Version 2.5.0.0 (PWA) • 📊 DISTR & TEST/LOGIC • 💰 FINANCE TVM • 🎯 SOLVER & CATALOG • 📈 Par/Pol • 💾 MEM & MATRIX
          </p>
          <button className="help-button" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};
