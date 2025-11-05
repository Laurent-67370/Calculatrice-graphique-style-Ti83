# Calculatrice TI-83 Plus - Version Web

Une calculatrice scientifique et graphique complète qui reproduit fidèlement l'interface et les fonctionnalités de la célèbre TI-83 Plus de Texas Instruments.

## 🌟 Fonctionnalités

### Calculs Scientifiques
- **Opérations de base** : addition, soustraction, multiplication, division
- **Fonctions trigonométriques** : sin, cos, tan et leurs inverses (asin, acos, atan)
- **Fonctions logarithmiques** : log (base 10), ln (logarithme naturel)
- **Fonctions exponentielles** : e^x, 10^x
- **Puissances et racines** : x^y, x², √x, x⁻¹
- **Constantes mathématiques** : π (pi), e (nombre d'Euler)

### Modes de Calcul
- **Mode RAD/DEG** : basculement entre radians et degrés pour les fonctions trigonométriques
- **Historique** : affichage des 3 derniers calculs
- **Variables** : stockage de valeurs dans les variables A-Z, X, Y, T, θ
- **Mémoire ANS** : rappel du dernier résultat

### Mode Graphique
- **Tracé de fonctions** : jusqu'à 6 fonctions simultanées (Y1-Y6)
- **Axes et grille** : repère orthonormé avec graduations
- **Zoom** : zoom in/out, presets (standard, trigonométrique, décimal)
- **Mode Trace** : exploration des courbes point par point
- **Fenêtre personnalisable** : ajustement de xMin, xMax, yMin, yMax
- **Analyse** : recherche de zéros, extrema, intersections

### Interface Authentique
- **Design TI-83** : reproduction fidèle du look & feel de la calculatrice originale
- **Écran LCD** : écran monochrome caractéristique
- **Clavier complet** : toutes les touches avec fonctions primaires et secondaires
- **Indicateurs** : affichage des modes actifs (RAD/DEG, STAT, GRAPH)
- **Touches colorées** : 2nd (jaune), ALPHA (vert), fonctions (bleu)

## 🚀 Démarrage Rapide

### Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-utilisateur/Calculatrice-graphique-style-Ti83.git
cd Calculatrice-graphique-style-Ti83
```

2. Ouvrez le fichier `index.html` dans votre navigateur web préféré :
```bash
# Sur Linux/Mac
open index.html

# Sur Windows
start index.html
```

Aucune installation de dépendances n'est nécessaire ! La calculatrice fonctionne entièrement côté client.

### Utilisation en Ligne

Vous pouvez également héberger la calculatrice sur n'importe quel serveur web statique (GitHub Pages, Netlify, Vercel, etc.).

## 📖 Guide d'Utilisation

### Calculs de Base

1. **Opérations simples** :
   - Tapez : `5 + 3`
   - Appuyez sur `ENTER`
   - Résultat : `8`

2. **Utilisation des parenthèses** :
   - Tapez : `(5 + 3) × 2`
   - Résultat : `16`

3. **Fonctions scientifiques** :
   - Tapez : `sin(45)` (en mode DEG)
   - Résultat : `0.7071067812`

### Fonctions Avancées

#### Utilisation de la touche 2nd
La touche jaune `2nd` active les fonctions secondaires (en jaune au-dessus des touches) :
- `2nd` + `SIN` = `SIN⁻¹` (arcsinus)
- `2nd` + `x²` = `√` (racine carrée)
- `2nd` + `^` = `π` (pi)

#### Utilisation de la touche ALPHA
La touche verte `ALPHA` permet d'entrer des lettres (en vert en haut à gauche des touches) :
- `ALPHA` + `X,T,θ,n` = `A`
- `ALPHA` + `STAT` = `B`
- etc.

#### Stockage de Variables
1. Calculez une valeur : `5 + 3` → `8`
2. Appuyez sur `STO►`
3. Sélectionnez une variable avec `ALPHA` + touche
4. Exemple : `STO► A` stocke 8 dans A

### Mode Graphique

#### Définir une Fonction

1. Appuyez sur `Y=`
2. L'éditeur affiche : `Y1=`
3. Entrez votre fonction, par exemple : `X^2`
4. Appuyez sur `GRAPH`

#### Fonctions Disponibles dans les Graphiques

Vous pouvez utiliser :
- Variables : `X`
- Opérations : `+`, `-`, `×`, `÷`, `^`
- Fonctions : `sin(X)`, `cos(X)`, `tan(X)`, `log(X)`, `ln(X)`, `√(X)`
- Constantes : `π`, `e`

**Exemples de fonctions** :
- Parabole : `X^2`
- Sinusoïde : `sin(X)`
- Exponentielle : `e^X`
- Logarithme : `ln(X)`
- Cercle (demi) : `√(9-X^2)`
- Fonction complexe : `sin(X^2)/X`

#### Ajuster la Fenêtre (WINDOW)

1. Appuyez sur `WINDOW`
2. Définissez :
   - `Xmin` : valeur minimale de X
   - `Xmax` : valeur maximale de X
   - `Ymin` : valeur minimale de Y
   - `Ymax` : valeur maximale de Y

#### Zoom

1. Appuyez sur `ZOOM`
2. Sélectionnez un preset :
   - `Standard` : -10 à 10 pour X et Y
   - `Trig` : adapté aux fonctions trigonométriques
   - `Decimal` : intervalles décimaux
   - `Square` : fenêtre carrée

#### Mode Trace

1. Tracez une fonction
2. Appuyez sur `TRACE`
3. Utilisez `◄` et `►` pour explorer la courbe
4. Les coordonnées (X, Y) s'affichent à l'écran

### Raccourcis Clavier

Le clavier physique de votre ordinateur est supporté :

| Touche | Action |
|--------|--------|
| `0-9` | Chiffres |
| `+` `-` `*` `/` | Opérations |
| `^` | Puissance |
| `(` `)` | Parenthèses |
| `.` | Virgule décimale |
| `,` | Virgule |
| `Enter` | ENTER (calculer) |
| `Backspace` | DEL (supprimer) |
| `Escape` | CLEAR (effacer) |
| `←` `→` | Navigation en mode graphique |
| `+` `-` (en mode graph) | Zoom in/out |

## 🎯 Exemples d'Utilisation

### Calculs Scientifiques

```
Exemple 1 : Calculer sin(30°)
1. Vérifier que le mode est DEG (indicateur en haut)
2. Taper : sin(30)
3. ENTER
Résultat : 0.5

Exemple 2 : Équation du second degré
Calculer (-b + √(b²-4ac)) / (2a) avec a=1, b=-5, c=6
1. Stocker les valeurs :
   1 STO► A
   -5 STO► B
   6 STO► C
2. Calculer :
   (-B + √(B^2 - 4×A×C)) ÷ (2×A)
   ENTER
Résultat : 3

Exemple 3 : Logarithme
log₁₀(1000)
1. Taper : log(1000)
2. ENTER
Résultat : 3
```

### Tracés Graphiques

```
Exemple 1 : Parabole
Y1 = X^2
Fenêtre : Xmin=-5, Xmax=5, Ymin=-1, Ymax=25

Exemple 2 : Fonctions trigonométriques
Y1 = sin(X)
Y2 = cos(X)
Fenêtre : Zoom → Trig

Exemple 3 : Fonction rationnelle
Y1 = 1/X
Fenêtre : Standard

Exemple 4 : Fonction polynomiale
Y1 = X^3 - 3×X^2 + 2×X + 1
Fenêtre : Xmin=-5, Xmax=5, Ymin=-10, Ymax=10
```

## 🏗️ Architecture Technique

### Structure du Projet

```
Calculatrice-graphique-style-Ti83/
├── index.html          # Structure HTML de la calculatrice
├── styles.css          # Styles CSS (interface TI-83)
├── calculator.js       # Moteur de calcul principal
├── graphing.js         # Moteur graphique
└── README.md          # Documentation
```

### Technologies Utilisées

- **HTML5** : structure de l'interface
- **CSS3** : stylisation et design
- **JavaScript ES6+** : logique de calcul et rendu graphique
- **Canvas API** : rendu des graphiques

### Classes Principales

#### `TI83Calculator` (calculator.js)
Classe principale qui gère :
- L'affichage
- La saisie utilisateur
- L'évaluation des expressions mathématiques
- La gestion des modes (RAD/DEG, 2nd, ALPHA)
- La mémoire et les variables
- L'historique des calculs

#### `GraphingEngine` (graphing.js)
Moteur de rendu graphique qui gère :
- Le tracé de fonctions
- Les axes et la grille
- Les transformations coordonnées ↔ pixels
- Le zoom et le panoramique
- Le mode trace
- L'analyse de fonctions (zéros, extrema)

## 🔧 Personnalisation

### Modifier les Couleurs

Éditez `styles.css` pour changer les couleurs de l'interface :

```css
.calculator {
    background: linear-gradient(145deg, #2c3e50, #1a1a2e);
}

.screen {
    background: #9ca99c; /* Couleur de l'écran LCD */
}

.key-blue {
    background: linear-gradient(145deg, #2980b9, #1f5a8a);
}
```

### Ajouter des Fonctions Mathématiques

Dans `calculator.js`, ajoutez vos fonctions dans la méthode `evaluateExpression()` :

```javascript
evaluateExpression(expr) {
    expr = expr
        // ... fonctions existantes ...
        .replace(/maFonction\(/g, 'Math.ceil('); // Exemple
    // ...
}
```

### Modifier les Presets de Zoom

Dans `graphing.js`, modifiez les presets :

```javascript
this.zoomPresets = {
    standard: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
    custom: { xMin: -20, xMax: 20, yMin: -5, yMax: 5 }
};
```

## 🐛 Dépannage

### La calculatrice ne s'affiche pas correctement
- Assurez-vous d'utiliser un navigateur moderne (Chrome, Firefox, Safari, Edge)
- Vérifiez que JavaScript est activé
- Essayez de vider le cache du navigateur

### Les calculs donnent "Error"
- Vérifiez la syntaxe de votre expression
- Assurez-vous que les parenthèses sont équilibrées
- Vérifiez que vous n'avez pas de division par zéro

### Le mode graphique ne fonctionne pas
- Assurez-vous d'avoir défini une fonction dans Y=
- Vérifiez que la fonction est valide (utilise X comme variable)
- Ajustez la fenêtre si le graphique est hors de vue

### Les fonctions trigonométriques donnent des résultats inattendus
- Vérifiez le mode d'angle (RAD ou DEG)
- En mode RAD, les angles sont en radians (π ≈ 3.14159)
- En mode DEG, les angles sont en degrés (180° = π rad)

## 📱 Compatibilité

### Navigateurs Supportés
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Appareils
- Desktop (Windows, Mac, Linux)
- Tablettes (iPad, Android)
- Mobiles (iOS, Android) avec interface responsive

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est distribué sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

## 🙏 Remerciements

- Texas Instruments pour la calculatrice TI-83 Plus originale
- La communauté open source pour l'inspiration

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

---

**Note** : Ce projet est une réimplémentation éducative et n'est pas affilié à Texas Instruments.

## 🎓 Ressources Supplémentaires

### Guides et Tutoriels
- [Manuel original de la TI-83](https://education.ti.com/en/guidebook/details/en/E80C97AD36DC4ADCB0D71505CE50EA2E/83p)
- [Fonctions mathématiques JavaScript](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math)

### Fonctionnalités à Venir
- [ ] Mode statistiques complet (régression, tests)
- [ ] Mode matrice
- [ ] Mode programmation
- [ ] Sauvegarde des fonctions et variables
- [ ] Export des graphiques en PNG
- [ ] Mode équation solver
- [ ] Calcul d'intégrales et dérivées numériques
- [ ] Support des nombres complexes

## 📊 Changelog

### Version 1.0.0 (2024)
- ✅ Interface TI-83 complète
- ✅ Calculatrice scientifique fonctionnelle
- ✅ Mode graphique avec tracé de fonctions
- ✅ Fonctions trigonométriques et logarithmiques
- ✅ Gestion des variables
- ✅ Mode trace
- ✅ Support clavier physique
- ✅ Design responsive

---

**Fait avec ❤️ pour l'éducation et la nostalgie des calculatrices graphiques**
