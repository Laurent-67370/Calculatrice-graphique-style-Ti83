# 🎯 Roadmap - Implémentation DRAW & LIST OPS

## Version cible : 2.6.0.0

---

## 📋 Phase 1 : DRAW (2ND + PRGM)

### Priorité : CRITIQUE
**Objectif** : Ajouter les outils de dessin sur graphique comme sur la vraie TI-83 Plus

---

### 🎨 Fonctionnalités DRAW à implémenter

#### 1. **Menu DRAW** (2ND + PRGM)
**Structure du menu** :
```
DRAW
1:ClrDraw         - Effacer tous les dessins
2:Line(           - Tracer une ligne entre deux points
3:Horizontal      - Ligne horizontale
4:Vertical        - Ligne verticale  
5:Tangent(        - Tangente à une courbe
6:DrawF           - Dessiner une fonction
7:Shade(          - Ombrage entre deux courbes
8:DrawInv         - Dessiner l'inverse d'une fonction
9:Circle(         - Dessiner un cercle
0:Text(           - Afficher du texte sur le graphique

DRAW > POINTS (sous-menu)
1:Pt-On(          - Activer un point
2:Pt-Off(         - Désactiver un point
3:Pt-Change(      - Inverser l'état d'un point

DRAW > STO (sous-menu)
1:StorePic        - Sauvegarder le graphique
2:RecallPic       - Rappeler un graphique
3:StoreGDB        - Sauvegarder la base de données graphique
4:RecallGDB       - Rappeler la base de données
```

---

### 🛠️ Architecture technique

#### Fichiers à créer :

1. **`src/services/DrawingService.ts`**
   - Service pour gérer tous les dessins
   - Stockage des éléments dessinés
   - Rendu sur le canvas

2. **`src/types/draw.types.ts`**
   ```typescript
   export type DrawElement = 
     | { type: 'line', x1: number, y1: number, x2: number, y2: number }
     | { type: 'horizontal', y: number }
     | { type: 'vertical', x: number }
     | { type: 'circle', x: number, y: number, r: number }
     | { type: 'text', x: number, y: number, text: string }
     | { type: 'function', expr: string }
     | { type: 'shade', f1: string, f2: string, xMin: number, xMax: number }
     | { type: 'point', x: number, y: number, on: boolean };

   export interface DrawState {
     elements: DrawElement[];
     pictures: { [key: string]: DrawElement[] }; // Pic1-Pic10
   }
   ```

3. **`src/data/drawMenus.ts`**
   - Définition du menu DRAW
   - Sous-menus POINTS et STO

4. **`src/utils/drawHandlers.ts`**
   - Handlers pour chaque commande DRAW
   - Gestion des interactions utilisateur

5. **`src/components/Editors/DrawEditor.tsx`**
   - Éditeur modal pour saisir les paramètres
   - Exemple : `Line(x1, y1, x2, y2)`

---

### 📝 Implémentation par ordre de priorité

#### **Niveau 1 - Basique** (v2.6.0.0)
1. ✅ **ClrDraw** : Effacer tous les dessins
   - Simple : `drawElements = []`
   
2. ✅ **Line(x1, y1, x2, y2)** : Tracer une ligne
   - Convertir coordonnées graphiques → pixels
   - Dessiner avec Canvas API
   
3. ✅ **Horizontal y** : Ligne horizontale
   - Ligne de xMin à xMax à hauteur y
   
4. ✅ **Vertical x** : Ligne verticale
   - Ligne de yMin à yMax à position x

5. ✅ **Text(x, y, "texte")** : Afficher du texte
   - Canvas `fillText()`

#### **Niveau 2 - Avancé** (v2.6.1.0)
6. ✅ **DrawF expr** : Dessiner une fonction
   - Évaluer l'expression
   - Tracer comme Y1-Y6
   
7. ✅ **Circle(x, y, r)** : Dessiner un cercle
   - Canvas `arc()`

8. ✅ **Pt-On(x, y)** : Activer un point
   - Petit carré/croix sur le graphique

#### **Niveau 3 - Expert** (v2.6.2.0)
9. ✅ **Tangent(expr, x)** : Tangente à une courbe
   - Calculer dérivée avec MathJS
   - Tracer la ligne tangente
   
10. ✅ **Shade(f1, f2, xMin, xMax)** : Ombrage
    - Remplir l'aire entre deux courbes
    - Canvas `fill()`

11. ✅ **DrawInv expr** : Dessiner l'inverse
    - Échanger X et Y
    - Tracer la courbe inversée

#### **Niveau 4 - Stockage** (v2.6.3.0)
12. ✅ **StorePic / RecallPic** : Sauvegarder/Rappeler
    - Stocker dans le state Zustand
    - 10 emplacements (Pic1-Pic10)

---

### 🔧 Modifications nécessaires

#### 1. **Clavier** (`Keyboard.tsx`)
```typescript
{ action: 'prgm', secondAction: 'draw', primary: 'PRGM', second: 'DRAW', color: 'gray' }
```
✅ Déjà présent

#### 2. **Types** (`calculator.types.ts`)
```typescript
export type CalculatorMode = 
  | 'NORMAL' | 'Y_EDITOR' | 'WINDOW' | ... 
  | 'DRAW_LINE' | 'DRAW_TEXT' | 'DRAW_CIRCLE'; // Nouveaux modes
```

#### 3. **Store** (`calculatorStore.ts`)
```typescript
interface CalculatorState {
  // ... existing
  drawElements: DrawElement[];
  pictures: { [key: string]: DrawElement[] };
  
  // Actions
  addDrawElement: (element: DrawElement) => void;
  clearDraw: () => void;
  storePicture: (name: string) => void;
  recallPicture: (name: string) => void;
}
```

#### 4. **GraphCanvas** (`GraphCanvas.tsx`)
Ajouter le rendu des éléments DRAW après le rendu des fonctions :
```typescript
// Après avoir dessiné les fonctions Y1-Y6
drawElements.forEach(element => {
  switch(element.type) {
    case 'line': drawLine(element); break;
    case 'circle': drawCircle(element); break;
    // ...
  }
});
```

#### 5. **Calculator** (`Calculator.tsx`)
Handler pour le menu DRAW :
```typescript
if (action === 'draw') {
  setCurrentMenu('DRAW');
  return;
}
```

---

## 📋 Phase 2 : LIST OPS (2ND + STAT)

### Priorité : CRITIQUE
**Objectif** : Ajouter les opérations avancées sur listes

---

### 📊 Fonctionnalités LIST à implémenter

#### 1. **Menu LIST** (2ND + STAT)
**Structure du menu** :
```
LIST
NAMES (sous-menu)
1:L₁              - Liste 1
2:L₂              - Liste 2
...
6:L₆              - Liste 6

OPS (sous-menu)
1:SortA(          - Trier croissant
2:SortD(          - Trier décroissant
3:dim(            - Dimension (taille)
4:Fill(           - Remplir avec une valeur
5:seq(            - Générer une séquence
6:cumSum(         - Somme cumulée
7:ΔList(          - Différences successives
8:Select(         - Sélectionner des éléments

MATH (sous-menu)
1:min(            - Minimum
2:max(            - Maximum
3:mean(           - Moyenne
4:median(         - Médiane
5:sum(            - Somme
6:prod(           - Produit
7:stdDev(         - Écart-type
8:variance(       - Variance
```

---

### 🛠️ Architecture technique

#### Fichiers à créer/modifier :

1. **`src/services/ListService.ts`**
   ```typescript
   export class ListService {
     // OPS
     static sortA(list: number[]): number[]
     static sortD(list: number[]): number[]
     static dim(list: number[]): number
     static fill(value: number, count: number): number[]
     static seq(expr: string, variable: string, start: number, end: number, step?: number): number[]
     static cumSum(list: number[]): number[]
     static deltaList(list: number[]): number[]
     
     // MATH
     static min(list: number[]): number
     static max(list: number[]): number
     static mean(list: number[]): number
     static median(list: number[]): number
     static sum(list: number[]): number
     static prod(list: number[]): number
     static stdDev(list: number[]): number
     static variance(list: number[]): number
   }
   ```

2. **`src/data/listMenus.ts`**
   - Menu LIST avec sous-menus NAMES, OPS, MATH

3. **`src/utils/listHandlers.ts`**
   - Handlers pour chaque fonction LIST

---

### 📝 Implémentation par ordre de priorité

#### **Niveau 1 - OPS Basiques** (v2.6.0.0)
1. ✅ **SortA(L₁)** : Trier croissant
   ```typescript
   [...list].sort((a, b) => a - b)
   ```

2. ✅ **SortD(L₁)** : Trier décroissant
   ```typescript
   [...list].sort((a, b) => b - a)
   ```

3. ✅ **dim(L₁)** : Taille de la liste
   ```typescript
   list.length
   ```

4. ✅ **Fill(value, L₁)** : Remplir
   ```typescript
   Array(list.length).fill(value)
   ```

#### **Niveau 2 - MATH Basiques** (v2.6.0.0)
5. ✅ **min(L₁)** : Minimum
   ```typescript
   Math.min(...list)
   ```

6. ✅ **max(L₁)** : Maximum
   ```typescript
   Math.max(...list)
   ```

7. ✅ **mean(L₁)** : Moyenne
   ```typescript
   sum(list) / list.length
   ```

8. ✅ **sum(L₁)** : Somme
   ```typescript
   list.reduce((a, b) => a + b, 0)
   ```

9. ✅ **prod(L₁)** : Produit
   ```typescript
   list.reduce((a, b) => a * b, 1)
   ```

#### **Niveau 3 - Stats Avancées** (v2.6.1.0)
10. ✅ **median(L₁)** : Médiane
    ```typescript
    const sorted = [...list].sort((a,b) => a-b)
    sorted[Math.floor(sorted.length/2)]
    ```

11. ✅ **stdDev(L₁)** : Écart-type
    ```typescript
    Math.sqrt(variance(list))
    ```

12. ✅ **variance(L₁)** : Variance
    ```typescript
    const m = mean(list)
    mean(list.map(x => (x-m)**2))
    ```

#### **Niveau 4 - OPS Avancées** (v2.6.2.0)
13. ✅ **cumSum(L₁)** : Somme cumulée
    ```typescript
    list.reduce((acc, val, i) => [...acc, (acc[i-1]||0) + val], [])
    ```

14. ✅ **ΔList(L₁)** : Différences
    ```typescript
    list.slice(1).map((v, i) => v - list[i])
    ```

15. ✅ **seq(expr, var, start, end, step)** : Séquence
    ```typescript
    // Générer une liste selon une formule
    // Exemple : seq(X², X, 1, 10, 1) → [1, 4, 9, 16, ..., 100]
    ```

---

### 🔧 Modifications nécessaires

#### 1. **Clavier** (`Keyboard.tsx`)
La touche LIST existe déjà :
```typescript
{ action: '2', secondAction: 'list', primary: '2', second: 'LIST', alpha: 'J' }
```

#### 2. **Calculator** (`Calculator.tsx`)
```typescript
if (action === 'list') {
  setCurrentMenu('LIST');
  return;
}
```

#### 3. **Store** - Aucune modification
Les listes L1-L6 existent déjà dans le store

---

## 🎯 Planning de développement

### Sprint 1 : DRAW Basique (v2.6.0.0) - 3-4h
- [ ] Créer DrawingService.ts
- [ ] Créer draw.types.ts
- [ ] Créer drawMenus.ts
- [ ] Ajouter handler 'draw' dans Calculator.tsx
- [ ] Implémenter ClrDraw
- [ ] Implémenter Line(
- [ ] Implémenter Horizontal
- [ ] Implémenter Vertical
- [ ] Implémenter Text(
- [ ] Intégrer le rendu dans GraphCanvas.tsx
- [ ] Tests

### Sprint 2 : DRAW Avancé (v2.6.1.0) - 2-3h
- [ ] Implémenter DrawF
- [ ] Implémenter Circle(
- [ ] Implémenter Pt-On(, Pt-Off(
- [ ] Tests

### Sprint 3 : DRAW Expert (v2.6.2.0) - 2-3h
- [ ] Implémenter Tangent(
- [ ] Implémenter Shade(
- [ ] Implémenter DrawInv
- [ ] Tests

### Sprint 4 : DRAW Stockage (v2.6.3.0) - 1-2h
- [ ] Implémenter StorePic/RecallPic
- [ ] Tests

### Sprint 5 : LIST Basique (v2.6.0.0) - 2h
- [ ] Créer ListService.ts
- [ ] Créer listMenus.ts
- [ ] Ajouter handler 'list' dans Calculator.tsx
- [ ] Implémenter OPS : SortA, SortD, dim, Fill
- [ ] Implémenter MATH : min, max, mean, sum, prod
- [ ] Tests

### Sprint 6 : LIST Avancé (v2.6.1.0) - 2h
- [ ] Implémenter median, stdDev, variance
- [ ] Tests

### Sprint 7 : LIST Expert (v2.6.2.0) - 2h
- [ ] Implémenter cumSum, ΔList
- [ ] Implémenter seq(
- [ ] Tests

---

## 📊 Résultat attendu

Après ces implémentations :

| Fonctionnalité | Avant | Après |
|----------------|-------|-------|
| **DRAW** | 0% | 100% |
| **LIST OPS** | 60% | 100% |
| **Compatibilité globale** | 80% | **88%** |

---

## 🚀 Prochaines étapes après DRAW & LIST

Selon la roadmap initiale :

### Priorité 2 (v2.7.0.0)
- Séquences (mode SEQ complet)
- FORMAT (options d'affichage graphique)
- ENTRY (historique des entrées)

### Priorité 3 (v2.8.0.0)
- PRGM (programmation - gros morceau)
- Strings (manipulation de chaînes)
- Pictures (sauvegarde d'images)

---

**Prêt à commencer l'implémentation ?** 🎨📊

