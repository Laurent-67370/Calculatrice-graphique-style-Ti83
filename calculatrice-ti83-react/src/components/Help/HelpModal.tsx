/**
 * Modal d'aide à l'utilisation de la calculatrice TI-83 Plus
 */

import { useState } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'graph' | 'advanced'>('basic');

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
        </div>

        <div className="help-content">
          {activeTab === 'basic' && (
            <div className="help-section">
              <h3>🔢 Calculs de base</h3>
              <ul>
                <li><strong>Chiffres et opérateurs</strong> : Utilisez le clavier numérique et les touches +, −, ×, ÷</li>
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

              <h3>🧮 Menu MATH</h3>
              <ul>
                <li><strong>NUM</strong> : Fonctions numériques (abs, round, min, max, etc.)</li>
                <li><strong>CPX</strong> : Nombres complexes</li>
                <li><strong>PRB</strong> : Probabilités (rand, nCr, nPr, factorielle)</li>
              </ul>

              <h3>🎨 Fonctionnalités supplémentaires</h3>
              <ul>
                <li><strong>Navigation fluide</strong> : Tous les éditeurs fonctionnent avec le clavier virtuel</li>
                <li><strong>Sauvegarde automatique</strong> : Les paramètres sont sauvegardés en fermant avec CLEAR</li>
                <li><strong>Historique</strong> : Les calculs précédents sont affichés en haut de l'écran</li>
                <li><strong>Mode SECOND</strong> : S'éteint automatiquement après utilisation</li>
              </ul>

              <h3>🎓 Exemples de fonctions</h3>
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

              <h3>💡 Astuces</h3>
              <ul>
                <li>Utilisez le mode DEGREE pour les angles en degrés</li>
                <li>Utilisez TRACE après GRAPH pour analyser les courbes</li>
                <li>Les parenthèses sont importantes : <code>sin(X^2)</code> ≠ <code>sin(X)^2</code></li>
                <li>Pour tracer plusieurs fonctions, définissez Y1, Y2, Y3, etc.</li>
              </ul>
            </div>
          )}
        </div>

        <div className="help-footer">
          <button className="help-button" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};
