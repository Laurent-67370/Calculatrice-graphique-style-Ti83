/**
 * Modal d'aide à l'utilisation de la calculatrice TI-83 Plus
 */

import { useState } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'draw' | 'graph' | 'stats' | 'advanced' | 'pwa'>('quick');

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
            className={`help-tab ${activeTab === 'quick' ? 'active' : ''}`}
            onClick={() => setActiveTab('quick')}
          >
            🚀 Démarrage
          </button>
          <button
            className={`help-tab ${activeTab === 'draw' ? 'active' : ''}`}
            onClick={() => setActiveTab('draw')}
          >
            🎨 DRAW
          </button>
          <button
            className={`help-tab ${activeTab === 'graph' ? 'active' : ''}`}
            onClick={() => setActiveTab('graph')}
          >
            📊 Graphiques
          </button>
          <button
            className={`help-tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📈 Stats & Listes
          </button>
          <button
            className={`help-tab ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            🔬 Avancé
          </button>
          <button
            className={`help-tab ${activeTab === 'pwa' ? 'active' : ''}`}
            onClick={() => setActiveTab('pwa')}
          >
            📱 Installer
          </button>
        </div>

        <div className="help-content">
          {activeTab === 'quick' && (
            <div className="help-section">
              <h3>🚀 Démarrage rapide</h3>
              <p style={{ fontSize: '0.95em', marginBottom: '15px', color: '#555' }}>
                Découvrez les fonctions essentielles pour commencer immédiatement !
              </p>

              <h3>🔢 Votre premier calcul</h3>
              <div className="help-examples">
                <strong>Exemple 1 - Calcul simple :</strong><br/>
                1. Tapez : <code>5 + 3 × 2</code><br/>
                2. Appuyez sur <code>ENTER</code><br/>
                → Résultat : <code>11</code><br/>
                <br/>
                <strong>Exemple 2 - Avec parenthèses :</strong><br/>
                <code>(5 + 3) × 2 = 16</code><br/>
                <br/>
                <strong>Exemple 3 - Puissances :</strong><br/>
                <code>2 ^ 8 = 256</code><br/>
                <code>10 ^ -3 = 0.001</code><br/>
              </div>

              <h3>🎯 Touches essentielles</h3>
              <ul>
                <li><strong>ENTER</strong> : Valider un calcul</li>
                <li><strong>DEL</strong> : Effacer le dernier caractère</li>
                <li><strong>CLEAR</strong> : Tout effacer</li>
                <li><strong>(−)</strong> : Signe négatif (ex: −5)</li>
                <li><strong>2ND</strong> : Fonctions secondaires (jaune)</li>
                <li><strong>ALPHA</strong> : Lettres (vert)</li>
              </ul>

              <h3>📐 Fonctions mathématiques courantes</h3>
              <div className="help-examples">
                <strong>Trigonométrie :</strong><br/>
                <code>sin(30) = 0.5</code> (en degrés)<br/>
                <code>cos(60) = 0.5</code><br/>
                <code>tan(45) = 1</code><br/>
                <br/>
                <strong>Racines et logarithmes :</strong><br/>
                <code>√(16) = 4</code><br/>
                <code>³√(27) = 3</code> (MATH → cbrt)<br/>
                <code>ln(e) = 1</code> (2.71828...)<br/>
                <code>log(100) = 2</code><br/>
                <br/>
                <strong>Fonctions inverses :</strong><br/>
                <code>2ND + SIN</code> → <code>sin⁻¹(0.5) = 30°</code><br/>
                <code>2ND + √</code> → <code>5² = 25</code><br/>
                <code>2ND + LN</code> → <code>e^2 = 7.389</code><br/>
              </div>

              <h3>🔄 Calculs en chaîne avec ANS</h3>
              <div className="help-examples">
                <strong>Méthode 1 - Avec ANS explicite :</strong><br/>
                <code>5 + 3 = 8</code><br/>
                <code>2ND + (−)</code> pour ANS → <code>ANS × 2 = 16</code><br/>
                <code>ANS - 4 = 12</code><br/>
                <br/>
                <strong>Méthode 2 - Automatique :</strong><br/>
                <code>100 = 100</code><br/>
                <code>÷ 4 → 100 ÷ 4 = 25</code> (ANS automatique !)<br/>
                <code>+ 5 → 25 + 5 = 30</code><br/>
                <code>√ → √(30) = 5.477...</code><br/>
              </div>

              <h3>💾 Stocker des valeurs dans des variables</h3>
              <div className="help-examples">
                <strong>Stockage :</strong><br/>
                1. Tapez : <code>42</code><br/>
                2. Appuyez sur <code>STO→</code><br/>
                3. Tapez : <code>ALPHA + A</code> (lettre A)<br/>
                4. <code>ENTER</code> → Stocké dans A<br/>
                <br/>
                <strong>Utilisation :</strong><br/>
                <code>A × 2 = 84</code><br/>
                <code>A + 10 = 52</code><br/>
                <br/>
                <strong>Raccourci en une ligne :</strong><br/>
                <code>42 → A</code> puis <code>ENTER</code><br/>
                <code>A × 2 = 84</code><br/>
              </div>

              <h3>⚙️ Configuration MODE</h3>
              <ul>
                <li><strong>MODE</strong> : Ouvrir les paramètres</li>
                <li><strong>DEGREE/RADIAN</strong> : Choisir l'unité des angles
                  <div className="help-examples" style={{ marginTop: '5px' }}>
                    DEGREE : <code>sin(90) = 1</code><br/>
                    RADIAN : <code>sin(π/2) = 1</code>
                  </div>
                </li>
                <li><strong>FUNC/PAR/POL</strong> : Type de graphique</li>
                <li><strong>FLOAT/FIXED</strong> : Nombre de décimales</li>
              </ul>

              <h3>🎓 Premiers pas avec les graphiques</h3>
              <div className="help-examples">
                <strong>Tracer Y = X² :</strong><br/>
                1. Appuyez sur <code>Y=</code><br/>
                2. Tapez : <code>X ^ 2</code><br/>
                3. <code>ENTER</code> pour valider<br/>
                4. <code>GRAPH</code> pour voir la parabole !<br/>
                <br/>
                <strong>Ajuster la vue :</strong><br/>
                <code>ZOOM</code> → <code>ZStandard</code> (fenêtre -10 à 10)<br/>
                <code>TRACE</code> → Déplacer le curseur avec ← →<br/>
              </div>

              <h3>💡 Astuces pour débutants</h3>
              <ul>
                <li>Les parenthèses sont importantes : <code>2×(3+4) = 14</code> mais <code>2×3+4 = 10</code></li>
                <li>Utilisez <code>2ND + ENTER</code> pour rappeler le dernier calcul</li>
                <li>La virgule <code>,</code> sépare les arguments : <code>max(5,3)</code> → tapez <code>2ND + 7</code></li>
                <li>Appuyez sur <code>CLEAR</code> pour fermer les menus et éditeurs</li>
              </ul>
            </div>
          )}

          {activeTab === 'draw' && (
            <div className="help-section">
              <h3>🎨 DRAW - Outils de dessin graphique</h3>
              <p style={{ fontSize: '0.95em', marginBottom: '15px', color: '#555' }}>
                Dessinez directement sur vos graphiques ! Lignes, cercles, texte et plus encore.
              </p>

              <h3>🚀 Accès au menu DRAW</h3>
              <div className="help-examples">
                Appuyez sur : <code>2ND + PRGM</code><br/>
                Le menu DRAW s'ouvre avec 12 commandes disponibles.
              </div>

              <h3>📏 Line - Tracer des lignes</h3>
              <div className="help-examples">
                <strong>Syntaxe :</strong> <code>Line(x1, y1, x2, y2)</code><br/>
                <br/>
                <strong>Exemple 1 - Diagonale :</strong><br/>
                1. <code>2ND + PRGM</code> → Menu DRAW<br/>
                2. Sélectionner <code>Line(</code><br/>
                3. Taper : <code>-5, -5, 5, 5)</code><br/>
                4. <code>ENTER</code> → Ligne de (-5,-5) à (5,5) !<br/>
                <br/>
                <strong>Exemple 2 - Ligne horizontale manuelle :</strong><br/>
                <code>Line(-10, 3, 10, 3)</code> → Ligne à y=3<br/>
                <br/>
                <strong>Exemple 3 - Ligne verticale manuelle :</strong><br/>
                <code>Line(2, -10, 2, 10)</code> → Ligne à x=2<br/>
                <br/>
                <strong>Exemple 4 - Triangle :</strong><br/>
                <code>Line(0, 5, -5, -5)</code><br/>
                <code>Line(-5, -5, 5, -5)</code><br/>
                <code>Line(5, -5, 0, 5)</code><br/>
              </div>

              <h3>⬌ Horizontal & Vertical - Lignes parfaites</h3>
              <div className="help-examples">
                <strong>Horizontal (ligne horizontale) :</strong><br/>
                <code>Horizontal 0</code> → Trace l'axe X<br/>
                <code>Horizontal 5</code> → Ligne à y=5<br/>
                <code>Horizontal -3</code> → Ligne à y=-3<br/>
                <br/>
                <strong>Vertical (ligne verticale) :</strong><br/>
                <code>Vertical 0</code> → Trace l'axe Y<br/>
                <code>Vertical 4</code> → Ligne à x=4<br/>
                <code>Vertical -2</code> → Ligne à x=-2<br/>
                <br/>
                <strong>Exemple - Quadrillage :</strong><br/>
                <code>Horizontal 0</code> (axe X)<br/>
                <code>Vertical 0</code> (axe Y)<br/>
                <code>Horizontal 5</code><br/>
                <code>Horizontal -5</code><br/>
                <code>Vertical 5</code><br/>
                <code>Vertical -5</code><br/>
              </div>

              <h3>⭕ Circle - Dessiner des cercles</h3>
              <div className="help-examples">
                <strong>Syntaxe :</strong> <code>Circle(x, y, rayon)</code><br/>
                <br/>
                <strong>Exemple 1 - Cercle centré :</strong><br/>
                <code>Circle(0, 0, 3)</code> → Cercle de rayon 3 au centre<br/>
                <br/>
                <strong>Exemple 2 - Cercle décalé :</strong><br/>
                <code>Circle(2, 3, 1.5)</code> → Cercle centré en (2,3), rayon 1.5<br/>
                <br/>
                <strong>Exemple 3 - Cible (cercles concentriques) :</strong><br/>
                <code>Circle(0, 0, 1)</code><br/>
                <code>Circle(0, 0, 2)</code><br/>
                <code>Circle(0, 0, 3)</code><br/>
                <code>Circle(0, 0, 4)</code><br/>
                <br/>
                <strong>Exemple 4 - Bonhomme sourire :</strong><br/>
                <code>Circle(0, 0, 5)</code> (tête)<br/>
                <code>Circle(-2, 2, 0.5)</code> (œil gauche)<br/>
                <code>Circle(2, 2, 0.5)</code> (œil droit)<br/>
                <code>Line(-2, -2, 2, -2)</code> (sourire - approximatif)<br/>
              </div>

              <h3>✏️ Text - Afficher du texte</h3>
              <div className="help-examples">
                <strong>Syntaxe :</strong> <code>Text(x, y, "texte")</code><br/>
                <br/>
                <strong>Exemple 1 - Label d'axe :</strong><br/>
                <code>Text(8, 0.5, "X")</code> → "X" à droite de l'axe X<br/>
                <code>Text(0.5, 8, "Y")</code> → "Y" en haut de l'axe Y<br/>
                <br/>
                <strong>Exemple 2 - Titre :</strong><br/>
                <code>Text(-8, 9, "Parabole")</code><br/>
                <br/>
                <strong>Exemple 3 - Annotation de point :</strong><br/>
                <code>Circle(3, 4, 0.3)</code> (point)<br/>
                <code>Text(3.5, 4.5, "(3,4)")</code> (coordonnées)<br/>
              </div>

              <h3>🧹 ClrDraw - Effacer les dessins</h3>
              <div className="help-examples">
                <strong>Utilisation :</strong><br/>
                1. <code>2ND + PRGM</code> → Menu DRAW<br/>
                2. Sélectionner <code>ClrDraw</code><br/>
                3. <code>ENTER</code><br/>
                → Tous les dessins disparaissent !<br/>
                <br/>
                <strong>Note :</strong> Les graphiques de fonctions (Y1, Y2...) ne sont PAS effacés.<br/>
                ClrDraw efface uniquement les éléments DRAW (lignes, cercles, texte).
              </div>

              <h3>🎯 Workflow complet - Exemple</h3>
              <div className="help-examples">
                <strong>Objectif : Dessiner un carré avec diagonales</strong><br/>
                <br/>
                1. <code>2ND + PRGM</code> → <code>ClrDraw</code> → <code>ENTER</code><br/>
                   (Nettoyer l'écran)<br/>
                <br/>
                2. <code>2ND + PRGM</code> → <code>Line(</code><br/>
                   <code>-5, -5, 5, -5)</code> → <code>ENTER</code> (bas)<br/>
                <br/>
                3. <code>2ND + PRGM</code> → <code>Line(</code><br/>
                   <code>5, -5, 5, 5)</code> → <code>ENTER</code> (droite)<br/>
                <br/>
                4. <code>2ND + PRGM</code> → <code>Line(</code><br/>
                   <code>5, 5, -5, 5)</code> → <code>ENTER</code> (haut)<br/>
                <br/>
                5. <code>2ND + PRGM</code> → <code>Line(</code><br/>
                   <code>-5, 5, -5, -5)</code> → <code>ENTER</code> (gauche)<br/>
                <br/>
                6. <code>2ND + PRGM</code> → <code>Line(</code><br/>
                   <code>-5, -5, 5, 5)</code> → <code>ENTER</code> (diagonale 1)<br/>
                <br/>
                7. <code>2ND + PRGM</code> → <code>Line(</code><br/>
                   <code>-5, 5, 5, -5)</code> → <code>ENTER</code> (diagonale 2)<br/>
                <br/>
                → Carré parfait avec ses diagonales !
              </div>

              <h3>🎨 Combiner DRAW et fonctions</h3>
              <div className="help-examples">
                <strong>Exemple - Fonction avec annotations :</strong><br/>
                1. <code>Y=</code> → <code>X^2</code> → <code>ENTER</code><br/>
                2. <code>GRAPH</code> (voir la parabole)<br/>
                3. <code>2ND + PRGM</code> → <code>Horizontal 0</code> → <code>ENTER</code><br/>
                4. <code>2ND + PRGM</code> → <code>Vertical 0</code> → <code>ENTER</code><br/>
                5. <code>2ND + PRGM</code> → <code>Circle(0, 0, 0.3)</code> → <code>ENTER</code><br/>
                6. <code>2ND + PRGM</code> → <code>Text(-1, -2, "Sommet")</code> → <code>ENTER</code><br/>
                <br/>
                → Parabole avec axes et annotation du sommet !
              </div>

              <h3>💡 Conseils DRAW</h3>
              <ul>
                <li>Les dessins utilisent le système de coordonnées de la fenêtre (WINDOW)</li>
                <li>Ajustez votre fenêtre avant de dessiner : <code>ZOOM → ZStandard</code></li>
                <li>Les dessins persistent jusqu'à <code>ClrDraw</code></li>
                <li>Pour voir vos dessins, le graphique doit être affiché (<code>GRAPH</code>)</li>
                <li>Combinez DRAW avec TRACE pour des annotations précises</li>
              </ul>

              <h3>🔮 Fonctions DRAW avancées (à venir)</h3>
              <ul>
                <li><strong>Tangent(</strong> : Tangente à une fonction</li>
                <li><strong>DrawF</strong> : Dessiner une fonction</li>
                <li><strong>Shade(</strong> : Ombrage entre courbes</li>
                <li><strong>Pt-On/Off/Change</strong> : Gestion de points</li>
                <li><strong>StorePic/RecallPic</strong> : Sauvegarder et rappeler des images</li>
              </ul>
            </div>
          )}

          {activeTab === 'graph' && (
            <div className="help-section">
              <h3>📊 Graphiques - Mode Function</h3>

              <h3>🎯 Tracer votre première fonction</h3>
              <div className="help-examples">
                <strong>Étape par étape :</strong><br/>
                1. <code>Y=</code> : Ouvrir l'éditeur de fonctions<br/>
                2. Taper : <code>X^2</code> (parabole)<br/>
                3. <code>ENTER</code> : Valider<br/>
                4. <code>GRAPH</code> : Afficher le graphique<br/>
                <br/>
                → Votre parabole apparaît !
              </div>

              <h3>📈 Exemples de fonctions</h3>
              <div className="help-examples">
                <strong>Polynômes :</strong><br/>
                <code>X^2</code> - Parabole<br/>
                <code>X^3 - 3*X</code> - Cubique<br/>
                <code>2*X + 3</code> - Droite<br/>
                <br/>
                <strong>Trigonométrie :</strong><br/>
                <code>sin(X)</code> - Sinus<br/>
                <code>cos(X)</code> - Cosinus<br/>
                <code>tan(X)</code> - Tangente<br/>
                <br/>
                <strong>Exponentielles et logarithmes :</strong><br/>
                <code>e^(X)</code> - <code>2ND + LN</code> puis <code>(X)</code><br/>
                <code>ln(X)</code> - Logarithme naturel<br/>
                <code>10^(X)</code> - <code>2ND + LOG</code> puis <code>(X)</code><br/>
                <br/>
                <strong>Autres :</strong><br/>
                <code>√(X)</code> - Racine carrée<br/>
                <code>1/X</code> - Hyperbole<br/>
                <code>abs(X)</code> - Valeur absolue<br/>
              </div>

              <h3>🔍 Mode TRACE - Explorer les courbes</h3>
              <div className="help-examples">
                1. Après <code>GRAPH</code>, appuyez sur <code>TRACE</code><br/>
                2. Un curseur apparaît sur la courbe<br/>
                3. <code>← →</code> : Déplacer le long de la courbe<br/>
                4. <code>↑ ↓</code> : Changer de fonction (Y1, Y2...)<br/>
                5. Les coordonnées (X,Y) s'affichent en haut<br/>
                <br/>
                <strong>Astuce :</strong> Tapez un nombre pendant TRACE pour aller à ce X !
              </div>

              <h3>🔎 Menu ZOOM - Ajuster la vue</h3>
              <ul>
                <li><strong>ZStandard</strong> : Fenêtre -10 à 10 (par défaut)</li>
                <li><strong>ZDecimal</strong> : Coordonnées décimales faciles</li>
                <li><strong>ZTrig</strong> : Optimisé pour sin/cos (−2π à 2π)</li>
                <li><strong>Zoom In</strong> : Zoomer (×2)</li>
                <li><strong>Zoom Out</strong> : Dézoomer (÷2)</li>
                <li><strong>ZSquare</strong> : Aspect ratio 1:1 (cercles ronds !)</li>
              </ul>

              <h3>⚙️ WINDOW - Configuration manuelle</h3>
              <div className="help-examples">
                1. <code>WINDOW</code> : Ouvrir les paramètres<br/>
                2. <code>↑ ↓</code> : Naviguer entre les champs<br/>
                3. Modifier : Xmin, Xmax, Ymin, Ymax<br/>
                4. <code>CLEAR</code> : Sauvegarder et fermer<br/>
                <br/>
                <strong>Exemple - Vue personnalisée :</strong><br/>
                Xmin = -5, Xmax = 5<br/>
                Ymin = 0, Ymax = 25<br/>
                → Parfait pour Y=X² de -5 à 5 !
              </div>

              <h3>🧮 Menu CALC - Calculs sur courbes</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Accès : <code>2ND + TRACE</code>
              </p>
              <ul>
                <li><strong>value</strong> : Calculer Y pour un X donné
                  <div className="help-examples" style={{ marginTop: '5px' }}>
                    Y1=X² → value à X=3 → Y=9
                  </div>
                </li>
                <li><strong>zero</strong> : Trouver les zéros (racines)
                  <div className="help-examples" style={{ marginTop: '5px' }}>
                    Y1=X²-4 → zero → X=2 (ou X=-2)
                  </div>
                </li>
                <li><strong>minimum</strong> : Trouver le minimum
                  <div className="help-examples" style={{ marginTop: '5px' }}>
                    Y1=X² → minimum → (0, 0)
                  </div>
                </li>
                <li><strong>maximum</strong> : Trouver le maximum</li>
                <li><strong>dy/dx</strong> : Dérivée en un point
                  <div className="help-examples" style={{ marginTop: '5px' }}>
                    Y1=X² → dy/dx à X=2 → 4
                  </div>
                </li>
                <li><strong>∫f(x)dx</strong> : Intégrale définie
                  <div className="help-examples" style={{ marginTop: '5px' }}>
                    Y1=X² → ∫ de 0 à 2 → 2.667
                  </div>
                </li>
              </ul>

              <h3>📋 TABLE - Affichage tabulaire</h3>
              <div className="help-examples">
                <strong>Configuration :</strong><br/>
                1. <code>2ND + WINDOW</code> (TBLSET)<br/>
                2. TblStart = 0 (début)<br/>
                3. ΔTbl = 1 (incrément)<br/>
                4. <code>CLEAR</code><br/>
                <br/>
                <strong>Affichage :</strong><br/>
                1. <code>2ND + GRAPH</code> (TABLE)<br/>
                2. Voir le tableau X / Y1 / Y2...<br/>
                3. <code>↑ ↓</code> pour naviguer<br/>
                <br/>
                <strong>Exemple - Table de X² :</strong><br/>
                Y1 = X²<br/>
                X=0 → Y1=0<br/>
                X=1 → Y1=1<br/>
                X=2 → Y1=4<br/>
                X=3 → Y1=9<br/>
              </div>

              <h3>🔄 Modes Parametric & Polar</h3>
              <h4>📐 Mode Parametric (courbes paramétriques)</h4>
              <div className="help-examples">
                <strong>Configuration :</strong><br/>
                1. <code>MODE</code> → Sélectionner <code>Par</code><br/>
                2. <code>Y=</code> → Entrer X1T= et Y1T=<br/>
                3. <code>WINDOW</code> → tMin=0, tMax=6.28, tStep=0.1<br/>
                4. <code>GRAPH</code><br/>
                <br/>
                <strong>Exemple - Cercle :</strong><br/>
                X1T = <code>cos(T)</code><br/>
                Y1T = <code>sin(T)</code><br/>
                tMin = 0, tMax = 6.28<br/>
                → Cercle unitaire !<br/>
                <br/>
                <strong>Exemple - Spirale :</strong><br/>
                X1T = <code>T*cos(T)</code><br/>
                Y1T = <code>T*sin(T)</code><br/>
              </div>

              <h4>🌀 Mode Polar (coordonnées polaires)</h4>
              <div className="help-examples">
                <strong>Configuration :</strong><br/>
                1. <code>MODE</code> → Sélectionner <code>Pol</code><br/>
                2. <code>Y=</code> → Entrer r1=<br/>
                3. <code>WINDOW</code> → θMin=0, θMax=6.28<br/>
                4. <code>GRAPH</code><br/>
                <br/>
                <strong>Exemple - Rose à 3 pétales :</strong><br/>
                r1 = <code>sin(3*θ)</code><br/>
                <br/>
                <strong>Exemple - Spirale d'Archimède :</strong><br/>
                r1 = <code>θ</code><br/>
                <br/>
                <strong>Exemple - Cardioïde :</strong><br/>
                r1 = <code>1 + cos(θ)</code><br/>
              </div>

              <h3>💡 Astuces graphiques</h3>
              <ul>
                <li>Vous pouvez tracer jusqu'à 6 fonctions simultanément (Y1-Y6)</li>
                <li>Utilisez <code>ZoomStat</code> après avoir défini des données statistiques</li>
                <li>Le mode TRACE montre les coordonnées exactes</li>
                <li>Combinez graphiques avec DRAW pour annoter</li>
              </ul>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="help-section">
              <h3>📈 Statistiques & Listes</h3>

              <h3>📊 LIST - Opérations sur listes (NOUVEAU !)</h3>
              <p style={{ fontSize: '0.95em', marginBottom: '15px', color: '#555' }}>
                Menu complet pour manipuler vos listes de données avec 15 fonctions !
              </p>

              <h4>🚀 Accès au menu LIST</h4>
              <div className="help-examples">
                Appuyez sur : <code>2ND + STAT</code> (au-dessus de la touche 2)<br/>
                3 sous-menus : NAMES, OPS, MATH
              </div>

              <h3>📝 NAMES - Accès rapide aux listes</h3>
              <div className="help-examples">
                <strong>Listes disponibles :</strong><br/>
                L₁, L₂, L₃, L₄, L₅, L₆<br/>
                <br/>
                <strong>Utilisation :</strong><br/>
                1. <code>2ND + STAT</code> → NAMES<br/>
                2. Sélectionner <code>L₁</code><br/>
                3. Utiliser dans un calcul : <code>mean(L₁)</code><br/>
              </div>

              <h3>🔧 OPS - 7 opérations sur listes</h3>
              <div className="help-examples">
                <strong>SortA( - Tri croissant :</strong><br/>
                Liste : <code>5, 2, 8, 1, 9</code><br/>
                <code>SortA(L₁)</code> → <code>1, 2, 5, 8, 9</code><br/>
                <br/>
                <strong>SortD( - Tri décroissant :</strong><br/>
                <code>SortD(L₁)</code> → <code>9, 8, 5, 2, 1</code><br/>
                <br/>
                <strong>dim( - Dimension (taille) :</strong><br/>
                L₁ = <code>5, 2, 8, 1, 9</code><br/>
                <code>dim(L₁)</code> → <code>5</code> (5 éléments)<br/>
                <br/>
                <strong>Fill( - Remplir avec une valeur :</strong><br/>
                <code>Fill(7, L₁)</code> → L₁ = <code>7, 7, 7, 7, 7</code><br/>
                <br/>
                <strong>seq( - Générer une séquence :</strong><br/>
                <code>seq(X^2, X, 1, 5, 1)</code><br/>
                → <code>1, 4, 9, 16, 25</code> (carrés de 1 à 5)<br/>
                <br/>
                <code>seq(2*X, X, 0, 10, 2)</code><br/>
                → <code>0, 4, 8, 12, 16, 20</code> (multiples de 2)<br/>
                <br/>
                <strong>cumSum( - Somme cumulée :</strong><br/>
                L₁ = <code>1, 2, 3, 4, 5</code><br/>
                <code>cumSum(L₁)</code> → <code>1, 3, 6, 10, 15</code><br/>
                <br/>
                <strong>ΔList( - Différences successives :</strong><br/>
                L₁ = <code>5, 8, 12, 17, 23</code><br/>
                <code>ΔList(L₁)</code> → <code>3, 4, 5, 6</code><br/>
              </div>

              <h3>📊 MATH - 8 fonctions statistiques</h3>
              <div className="help-examples">
                <strong>Exemple avec L₁ = {'{'} 2, 5, 3, 8, 1, 6, 4 {'}'} :</strong><br/>
                <br/>
                <code>min(L₁)</code> → <code>1</code> (minimum)<br/>
                <code>max(L₁)</code> → <code>8</code> (maximum)<br/>
                <code>mean(L₁)</code> → <code>4.143</code> (moyenne)<br/>
                <code>median(L₁)</code> → <code>4</code> (médiane)<br/>
                <code>sum(L₁)</code> → <code>29</code> (somme totale)<br/>
                <code>prod(L₁)</code> → <code>5760</code> (produit)<br/>
                <code>stdDev(L₁)</code> → <code>2.478</code> (écart-type)<br/>
                <code>variance(L₁)</code> → <code>6.143</code> (variance)<br/>
              </div>

              <h3>✏️ Éditer des listes (STAT &gt; Edit)</h3>
              <div className="help-examples">
                <strong>Ouvrir l'éditeur :</strong><br/>
                1. <code>STAT</code> → <code>Edit</code><br/>
                2. Éditeur de listes L1-L6 s'ouvre<br/>
                <br/>
                <strong>Navigation :</strong><br/>
                • <code>↑ ↓</code> : Monter/descendre dans la liste<br/>
                • <code>← →</code> : Changer de liste (L1, L2...)<br/>
                • <code>ENTER</code> : Éditer une valeur<br/>
                • Taper un nombre puis <code>ENTER</code><br/>
                • <code>CLEAR</code> : Fermer l'éditeur<br/>
                <br/>
                <strong>Exemple - Créer une liste :</strong><br/>
                1. <code>STAT</code> → <code>Edit</code><br/>
                2. Dans L1, taper : <code>10</code> <code>ENTER</code><br/>
                3. <code>15</code> <code>ENTER</code><br/>
                4. <code>12</code> <code>ENTER</code><br/>
                5. <code>18</code> <code>ENTER</code><br/>
                6. <code>20</code> <code>ENTER</code><br/>
                7. <code>CLEAR</code> pour fermer<br/>
                <br/>
                → L1 contient maintenant {'{'} 10, 15, 12, 18, 20 {'}'}
              </div>

              <h3>📊 STAT PLOT - Graphiques statistiques</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Accès : <code>2ND + Y=</code>
              </p>

              <h4>Types de graphiques disponibles :</h4>
              <ul>
                <li><strong>Scatter</strong> : Nuage de points</li>
                <li><strong>xyLine</strong> : Ligne reliant les points</li>
                <li><strong>Histogram</strong> : Histogramme</li>
                <li><strong>modBoxPlot</strong> : Boîte à moustaches modifiée</li>
                <li><strong>normBoxPlot</strong> : Boîte à moustaches normale</li>
              </ul>

              <h4>📍 Exemple complet - Nuage de points</h4>
              <div className="help-examples">
                <strong>Étape 1 - Entrer les données :</strong><br/>
                1. <code>STAT</code> → <code>Edit</code><br/>
                2. L1 : <code>1, 2, 3, 4, 5</code> (valeurs X)<br/>
                3. L2 : <code>2, 4, 5, 7, 9</code> (valeurs Y)<br/>
                4. <code>CLEAR</code><br/>
                <br/>
                <strong>Étape 2 - Configurer le plot :</strong><br/>
                1. <code>2ND + Y=</code> (STAT PLOT)<br/>
                2. Sélectionner <code>Plot1</code><br/>
                3. On : <code>ON</code><br/>
                4. Type : <code>Scatter</code> (⬧)<br/>
                5. Xlist : <code>L1</code><br/>
                6. Ylist : <code>L2</code><br/>
                7. Mark : <code>□</code> (carré)<br/>
                8. <code>CLEAR</code><br/>
                <br/>
                <strong>Étape 3 - Afficher :</strong><br/>
                <code>GRAPH</code> → Nuage de points affiché !<br/>
                <code>ZOOM</code> → <code>ZoomStat</code> pour ajuster la vue<br/>
              </div>

              <h4>📊 Exemple - Histogramme</h4>
              <div className="help-examples">
                <strong>Données :</strong><br/>
                L1 : <code>10, 15, 12, 18, 20, 14, 16, 22, 11, 19</code><br/>
                <br/>
                <strong>Configuration :</strong><br/>
                1. <code>2ND + Y=</code> → <code>Plot1</code><br/>
                2. On : <code>ON</code><br/>
                3. Type : <code>Histogram</code> (📊)<br/>
                4. Xlist : <code>L1</code><br/>
                5. <code>GRAPH</code><br/>
                <br/>
                → Histogramme avec bins automatiques !
              </div>

              <h3>📈 1-Var Stats - Statistiques à 1 variable</h3>
              <div className="help-examples">
                <strong>Calculer les stats de L1 :</strong><br/>
                1. Entrer des données dans L1<br/>
                2. <code>STAT</code> → <code>CALC</code> → <code>1-Var Stats</code><br/>
                3. Voir tous les résultats :<br/>
                   • n (nombre de valeurs)<br/>
                   • mean (moyenne)<br/>
                   • Σx (somme)<br/>
                   • Sx (écart-type échantillon)<br/>
                   • σx (écart-type population)<br/>
                   • min, Q1, Med, Q3, max (5 nombres)<br/>
              </div>

              <h3>💡 Astuces statistiques</h3>
              <ul>
                <li>Les 3 plots (Plot1, Plot2, Plot3) peuvent être actifs simultanément</li>
                <li>Utilisez <code>ZoomStat</code> après avoir configuré un plot</li>
                <li>Chaque plot peut avoir un marqueur différent (□, +, •)</li>
                <li>Les plots se superposent aux fonctions Y1-Y6</li>
                <li>seq() est très puissant : <code>seq(sin(X), X, 0, 6.28, 0.1)</code></li>
              </ul>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="help-section">
              <h3>🔬 Fonctions avancées</h3>

              <h3>🎯 SOLVER - Résolveur d'équations</h3>
              <p style={{ fontSize: '0.95em', marginBottom: '15px', color: '#555' }}>
                Trouvez les racines de n'importe quelle équation f(X)=0 avec précision !
              </p>

              <div className="help-examples">
                <strong>Accès :</strong> <code>MATH</code> → <code>0:Solver...</code><br/>
                <br/>
                <strong>Utilisation :</strong><br/>
                1. <code>MATH</code> → <code>0:Solver...</code><br/>
                2. Équation : Entrer votre équation (ex: <code>X^2-4</code>)<br/>
                3. Estimation : Valeur de départ (ex: <code>1</code>)<br/>
                4. <code>GRAPH</code> : Résoudre<br/>
                → X = 2.0000000000<br/>
                <br/>
                <strong>Exemples d'équations :</strong><br/>
                <code>X^2 - 4</code> avec <code>1</code> → X = 2<br/>
                <code>X^3 - 2*X - 5</code> avec <code>2</code> → X = 2.0946<br/>
                <code>sin(X) - 0.5</code> avec <code>0.5</code> → X = 0.5236 rad<br/>
                <code>ln(X) - 2</code> avec <code>5</code> → X = 7.3891<br/>
                <code>e^X - 5*X</code> avec <code>0.5</code> → X = 0.2592<br/>
              </div>

              <h3>💰 FINANCE - Calculateur TVM</h3>
              <p style={{ fontSize: '0.95em', marginBottom: '15px', color: '#555' }}>
                Time Value of Money - Calculs financiers professionnels !
              </p>

              <div className="help-examples">
                <strong>Accès :</strong> <code>APPS</code> (Finance TVM Solver)<br/>
                <br/>
                <strong>Variables :</strong><br/>
                • N : Nombre de périodes<br/>
                • I% : Taux d'intérêt annuel<br/>
                • PV : Valeur actuelle (capital initial)<br/>
                • PMT : Paiement périodique<br/>
                • FV : Valeur future (capital final)<br/>
                • P/Y : Paiements par an (12=mensuel)<br/>
                • C/Y : Compositions par an (12=mensuel)<br/>
                <br/>
                <strong>Exemple 1 - Prêt auto :</strong><br/>
                PV = <code>15000</code> (emprunt 15k€)<br/>
                I% = <code>4.2</code> (taux 4.2%)<br/>
                N = <code>48</code> (4 ans × 12 mois)<br/>
                FV = <code>0</code><br/>
                P/Y = <code>12</code>, C/Y = <code>12</code><br/>
                → Calculer PMT = <code>-340.58€</code>/mois<br/>
                <br/>
                <strong>Exemple 2 - Épargne :</strong><br/>
                PMT = <code>-200</code> (versement 200€/mois)<br/>
                I% = <code>5</code> (rendement 5%)<br/>
                N = <code>120</code> (10 ans × 12)<br/>
                PV = <code>0</code><br/>
                → Calculer FV = <code>31,056€</code> (capital final)<br/>
              </div>

              <h3>📚 CATALOG - Toutes les fonctions</h3>
              <div className="help-examples">
                <strong>Accès :</strong> <code>2ND + 0</code><br/>
                <br/>
                <strong>Utilisation :</strong><br/>
                • <code>↑ ↓</code> : Naviguer dans la liste<br/>
                • <code>A-Z</code> : Taper une lettre pour sauter<br/>
                • <code>ENTER</code> : Insérer la fonction<br/>
                <br/>
                <strong>Exemple :</strong><br/>
                1. <code>2ND + 0</code> → CATALOG s'ouvre<br/>
                2. Taper <code>S</code> → Saute à "sin"<br/>
                3. <code>↓</code> jusqu'à "sqrt"<br/>
                4. <code>ENTER</code> → Insère "sqrt("<br/>
              </div>

              <h3>📊 DISTR - Distributions statistiques</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Accès : <code>2ND + VARS</code>
              </p>

              <h4>📈 Distributions continues</h4>
              <div className="help-examples">
                <strong>Loi Normale :</strong><br/>
                <code>normalcdf(-1.96, 1.96, 0, 1)</code> → 0.95 (95%)<br/>
                <code>invNorm(0.975, 0, 1)</code> → 1.96 (quantile)<br/>
                <br/>
                <strong>Loi de Student (t) :</strong><br/>
                <code>tcdf(-2, 2, 9)</code> → 0.926 (avec df=9)<br/>
                <br/>
                <strong>Loi du Chi-carré :</strong><br/>
                <code>χ²cdf(0, 5, 4)</code> → 0.713 (avec df=4)<br/>
              </div>

              <h4>🎲 Distributions discrètes</h4>
              <div className="help-examples">
                <strong>Loi Binomiale :</strong><br/>
                <code>binompdf(10, 0.5, 5)</code> → 0.246 P(X=5)<br/>
                <code>binomcdf(10, 0.5, 5)</code> → 0.623 P(X≤5)<br/>
                <br/>
                <strong>Loi de Poisson :</strong><br/>
                <code>poissonpdf(3, 2)</code> → 0.224 P(X=2)<br/>
                <code>poissoncdf(3, 2)</code> → 0.423 P(X≤2)<br/>
              </div>

              <h3>🧠 Menu MATH - 38 fonctions</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Navigation hiérarchique avec 6 catégories
              </p>

              <h4>Catégories principales :</h4>
              <ul>
                <li><strong>MATH</strong> : ³√, logBASE, e^x, 10^x, hypot</li>
                <li><strong>NUM ▶</strong> : abs, round, iPart, fPart, min, max, gcd, lcm, ceil, floor, sign, trunc, mod</li>
                <li><strong>CPX ▶</strong> : conj, real, imag, angle, abs, Rect, Polar</li>
                <li><strong>PRB ▶</strong> : rand, nPr, nCr, !, randInt, randNorm, randBin</li>
                <li><strong>ANGLE ▶</strong> : °→rad, rad→°, →DMS, →Dec</li>
                <li><strong>TRIG ▶</strong> : sinh, cosh, tanh, asinh, acosh, atanh</li>
              </ul>

              <div className="help-examples">
                <strong>Exemples MATH :</strong><br/>
                <code>cbrt(27)</code> → 3 (racine cubique)<br/>
                <code>logBASE(8, 2)</code> → 3 (log₂(8))<br/>
                <code>hypot(3, 4)</code> → 5 (hypoténuse)<br/>
                <br/>
                <strong>Exemples NUM :</strong><br/>
                <code>abs(-10)</code> → 10<br/>
                <code>gcd(24, 18)</code> → 6 (PGCD)<br/>
                <code>lcm(12, 18)</code> → 36 (PPCM)<br/>
                <code>ceil(3.2)</code> → 4 (arrondi sup)<br/>
                <br/>
                <strong>Exemples PRB :</strong><br/>
                <code>nPr(10, 3)</code> → 720 (permutations)<br/>
                <code>nCr(10, 5)</code> → 252 (combinaisons)<br/>
                <code>randInt(1, 6)</code> → 4 (dé à 6 faces)<br/>
              </div>

              <h3>🔍 TEST & LOGIC</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Accès : <code>2ND + MATH</code>
              </p>

              <div className="help-examples">
                <strong>Opérateurs TEST (retournent 1 ou 0) :</strong><br/>
                <code>5 &gt; 3</code> → 1 (vrai)<br/>
                <code>2 = 3</code> → 0 (faux)<br/>
                <code>10 ≥ 10</code> → 1 (vrai)<br/>
                <br/>
                <strong>Opérateurs LOGIC :</strong><br/>
                <code>(5 &gt; 3) and (2 &lt; 4)</code> → 1<br/>
                <code>(1 = 1) or (2 = 3)</code> → 1<br/>
                <code>not(0)</code> → 1<br/>
                <code>(1 = 1) xor (2 = 2)</code> → 0<br/>
              </div>

              <h3>📊 Menu MATRIX - Calcul matriciel</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Accès : <code>2ND + X⁻¹</code>
              </p>

              <div className="help-examples">
                <strong>Éditer une matrice :</strong><br/>
                1. <code>2ND + X⁻¹</code> → MATRIX<br/>
                2. EDIT → Sélectionner [A]<br/>
                3. Touche <code>D</code> : Changer dimensions<br/>
                4. <code>← → ↑ ↓</code> : Naviguer<br/>
                5. <code>ENTER</code> : Éditer une cellule<br/>
                6. <code>CLEAR</code> : Fermer<br/>
                <br/>
                <strong>Opérations matricielles :</strong><br/>
                <code>[A] + [B]</code> - Addition<br/>
                <code>[A] * [B]</code> - Produit matriciel<br/>
                <code>5 * [A]</code> - Multiplication scalaire<br/>
                <code>[A] ^ 2</code> - Puissance<br/>
                <code>[A]^T</code> - Transposée<br/>
                <code>det([A])</code> - Déterminant<br/>
                <code>inv([A])</code> - Inverse<br/>
                <code>identity(3)</code> - Matrice identité 3×3<br/>
              </div>

              <h3>🧠 Menu MEM - Gestion mémoire</h3>
              <p style={{ fontSize: '0.9em', marginBottom: '10px' }}>
                Accès : <code>2ND + +</code>
              </p>

              <ul>
                <li><strong>Reset</strong> : Réinitialiser toute la mémoire</li>
                <li><strong>Delete</strong> : Supprimer des éléments
                  <ul style={{ marginLeft: '20px', fontSize: '0.9em' }}>
                    <li>Variables A-Z, θ</li>
                    <li>Listes L1-L6</li>
                    <li>Matrices A-J</li>
                  </ul>
                </li>
                <li>Navigation : <code>↑ ↓ ← →</code> entre catégories</li>
              </ul>
            </div>
          )}

          {activeTab === 'pwa' && (
            <div className="help-section">
              <h3>📱 Installer l'application</h3>
              <p style={{ fontSize: '0.95em', marginBottom: '15px', color: '#555' }}>
                Cette calculatrice est une <strong>Progressive Web App (PWA)</strong> installable comme une vraie app !
              </p>

              <h3>✨ Avantages de l'installation</h3>
              <ul>
                <li>📲 <strong>Icône sur l'écran d'accueil</strong> - Comme une app du Play Store</li>
                <li>📴 <strong>Fonctionne hors ligne</strong> - Pas besoin d'Internet après installation</li>
                <li>⚡ <strong>Chargement instantané</strong> - Cache optimisé</li>
                <li>🔄 <strong>Mises à jour automatiques</strong> - Toujours la dernière version</li>
                <li>🚀 <strong>Mode plein écran</strong> - Sans barre d'adresse</li>
                <li>💾 <strong>Ultra légère</strong> - Seulement 355 KB !</li>
              </ul>

              <h3>🎯 Installation en 3 étapes (Android)</h3>
              <div className="help-examples">
                <strong>Étape 1 :</strong> Ouvrez <strong>Chrome</strong> sur Android<br/>
                <strong>Étape 2 :</strong> Visitez www.lhusser.fr/calculatrice<br/>
                <strong>Étape 3 :</strong> Menu <strong>⋮</strong> → "Ajouter à l'écran d'accueil"<br/>
                <br/>
                ✨ <strong>C'est tout !</strong> L'icône "TI-83 Plus" apparaît sur votre écran.
              </div>

              <h3>🍎 Installation sur iOS (iPhone/iPad)</h3>
              <div className="help-examples">
                <strong>Étape 1 :</strong> Ouvrez <strong>Safari</strong> (pas Chrome !)<br/>
                <strong>Étape 2 :</strong> Visitez www.lhusser.fr/calculatrice<br/>
                <strong>Étape 3 :</strong> Bouton <strong>Partager</strong> (□↑)<br/>
                <strong>Étape 4 :</strong> "Sur l'écran d'accueil"<br/>
                <br/>
                Note : Le mode hors ligne peut être limité sur iOS.
              </div>

              <h3>📱 Utilisation de l'app installée</h3>
              <ul>
                <li>Tapez sur l'icône "TI-83 Plus" pour lancer</li>
                <li>L'app s'ouvre en mode <strong>autonome</strong> (sans navigateur)</li>
                <li>Toutes les fonctions marchent <strong>hors ligne</strong></li>
                <li>Les mises à jour se font <strong>automatiquement</strong></li>
                <li>Utilisable en <strong>mode avion</strong> ✈️ (parfait pour les examens !)</li>
              </ul>

              <h3>🔄 Mise à jour de l'application</h3>
              <p>Quand une nouvelle version est disponible :</p>
              <ul>
                <li>Un message s'affiche automatiquement</li>
                <li>Tapez sur "Recharger" pour mettre à jour</li>
                <li>Ou attendez, la mise à jour se fera au prochain lancement</li>
              </ul>

              <h3>🗑️ Désinstallation</h3>
              <div className="help-examples">
                <strong>Android :</strong><br/>
                1. Maintenez l'icône "TI-83 Plus"<br/>
                2. Glissez vers "Désinstaller"<br/>
                3. Confirmez<br/>
                <br/>
                <strong>iOS :</strong><br/>
                1. Maintenez l'icône<br/>
                2. "Supprimer l'app"<br/>
                3. Confirmez
              </div>

              <h3>❓ Dépannage</h3>
              <ul>
                <li><strong>Option non disponible :</strong> Utilisez Chrome 80+ (Android) ou Safari (iOS)</li>
                <li><strong>Icône n'apparaît pas :</strong> Attendez 5-10 secondes après le chargement</li>
                <li><strong>Mode hors ligne ne marche pas :</strong> Ouvrez l'app au moins une fois avec Internet</li>
                <li><strong>App ne se lance pas :</strong> Vérifiez votre connexion et réinstallez</li>
              </ul>

              <h3>📊 Informations techniques</h3>
              <ul>
                <li><strong>Taille</strong> : 355 KB (299 KB compressé)</li>
                <li><strong>Compatibilité</strong> : Chrome 80+, Safari 14+, Samsung Internet 12+</li>
                <li><strong>Cache</strong> : 13 fichiers en cache local</li>
                <li><strong>Mises à jour</strong> : Automatiques en arrière-plan</li>
                <li><strong>Version</strong> : 2.6.0.0</li>
              </ul>

              <h3>💡 Astuce pour les étudiants</h3>
              <p style={{ fontSize: '0.95em', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
                Une fois installée, vous pouvez utiliser la calculatrice <strong>partout</strong>,
                même en <strong>mode avion</strong> ! Parfait pour les examens, les cours sans WiFi,
                ou quand vous êtes en déplacement. Aucune connexion Internet requise après l'installation initiale.
              </p>
            </div>
          )}
        </div>

        <div className="help-footer">
          <p style={{ fontSize: '0.85em', marginBottom: '10px', color: '#666' }}>
            Version 2.6.0.0 (PWA) • 🎨 DRAW & LIST OPS • 📊 DISTR & TEST • 💰 FINANCE • 🎯 SOLVER • 📈 Par/Pol • 💾 MATRIX
          </p>
          <button className="help-button" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};
