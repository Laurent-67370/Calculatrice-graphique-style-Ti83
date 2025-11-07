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
                <li><strong>💾 Ultra légère</strong> - Seulement 365 KB</li>
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
                <li><strong>Taille</strong> : 365 KB (140 KB compressé)</li>
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
            Version 2.2.1 (PWA) • 🔧 Mode ALPHA corrigé • 📱 Installable sur Android • 📴 Hors ligne
          </p>
          <button className="help-button" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
};
