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
                <li><strong>MATH (Principal)</strong> : ³√, logBASE, e^x, 10^x, hypot</li>
                <li><strong>NUM ▶</strong> : abs, round, iPart, fPart, min, max, gcd, lcm, ceil, floor, sign, trunc, mod</li>
                <li><strong>CPX ▶</strong> : conj, real, imag, angle, abs, Rect, Polar</li>
                <li><strong>PRB ▶</strong> : rand, nPr, nCr, !, randInt, randNorm, randBin</li>
                <li><strong>ANGLE ▶</strong> : °→rad, rad→°, →DMS, →Dec</li>
                <li><strong>TRIG ▶</strong> : sinh, cosh, tanh, asinh, acosh, atanh</li>
              </ul>

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
            Version 2.2.7.0 (PWA) • 📊 TABLE & STAT PLOT • 📈 Par/Pol modes • 💾 STO→ & RCL • 🧠 MEM & MATRIX
          </p>
          <button className="help-button" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};
