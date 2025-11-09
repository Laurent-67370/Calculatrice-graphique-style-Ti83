# Tests Phase 5 - Fonctionnalités Avancées

## Fonctionnalités implémentées

### ✅ Commandes avancées
- **DelVar** : Supprimer une variable
- **ClrList** : Effacer des listes (préparation)
- **prgm** : Appeler un sous-programme
- **Menu** : Menu interactif avec navigation

## Programmes de test

### Test 1 : DelVar - Suppression de variable

```basic
PROGRAM:DELVAR1
:5→A
:10→B
:Disp "A=",A
:Disp "B=",B
:DelVar A
:Disp "APRES DELVAR A"
:If A=0
:Then
:Disp "A EST 0"
:Else
:Disp "A N'EXISTE PLUS"
:End
```

**Résultat attendu :**
```
A=5
B=10
APRES DELVAR A
A EST 0
```

### Test 2 : prgm - Appel de sous-programme simple

**Programme principal :**
```basic
PROGRAM:MAIN1
:Disp "DEBUT MAIN"
:5→X
:prgm SUB1
:Disp "FIN MAIN"
:Disp "X=",X
```

**Sous-programme :**
```basic
PROGRAM:SUB1
:Disp "DANS SUB1"
:X*2→X
:Disp "X DOUBLE=",X
:Return
```

**Résultat attendu :**
```
DEBUT MAIN
DANS SUB1
X DOUBLE=10
FIN MAIN
X=10
```

**Note :** Les variables sont globales, donc X est modifié dans le sous-programme.

### Test 3 : prgm - Calcul de factorielle avec sous-programme

**Programme principal :**
```basic
PROGRAM:FACTMAIN
:Input "N=",N
:prgm FACT
:Disp "N!=",F
```

**Sous-programme de calcul :**
```basic
PROGRAM:FACT
:1→F
:For(I,1,N)
:F*I→F
:End
:Return
```

**Exemple d'exécution :**
```
N=?5
N!=120
```

### Test 4 : Menu - Menu interactif simple

```basic
PROGRAM:MENUSIMPLE
:Lbl 0
:ClrHome
:Menu("OPERATIONS","AIRE",1,"PERIMETRE",2,"QUITTER",3)
:
:Lbl 1
:Input "RAYON:",R
:π*R²→A
:Disp "AIRE=",A
:Pause
:Goto 0
:
:Lbl 2
:Input "RAYON:",R
:2*π*R→P
:Disp "PERIMETRE=",P
:Pause
:Goto 0
:
:Lbl 3
:Disp "AU REVOIR"
:Stop
```

**Résultat attendu :**
- Affiche un menu avec 3 options
- L'utilisateur sélectionne une option en cliquant sur le bouton correspondant
- Le programme saute au label approprié
- Retour au menu après chaque calcul

### Test 5 : Programme complet - Calculatrice avec menu et sous-programmes

**Programme principal :**
```basic
PROGRAM:CALC
:ClrHome
:Lbl 0
:Menu("CALCULATRICE","ADDITION",1,"MULTIPLICATION",2,"PUISSANCE",3,"QUIT",9)
:
:Lbl 1
:prgm ADD
:Goto 0
:
:Lbl 2
:prgm MULT
:Goto 0
:
:Lbl 3
:prgm POW
:Goto 0
:
:Lbl 9
:Disp "BYE!"
:Stop
```

**Sous-programme Addition :**
```basic
PROGRAM:ADD
:Input "A=",A
:Input "B=",B
:A+B→R
:Disp "RESULTAT=",R
:Pause
:DelVar A
:DelVar B
:DelVar R
:Return
```

**Sous-programme Multiplication :**
```basic
PROGRAM:MULT
:Input "A=",A
:Input "B=",B
:A*B→R
:Disp "RESULTAT=",R
:Pause
:DelVar A
:DelVar B
:DelVar R
:Return
```

**Sous-programme Puissance :**
```basic
PROGRAM:POW
:Input "BASE=",A
:Input "EXP=",B
:A^B→R
:Disp "RESULTAT=",R
:Pause
:DelVar A
:DelVar B
:DelVar R
:Return
```

**Fonctionnalités démontrées :**
- Menu interactif
- Appels de sous-programmes multiples
- Variables globales
- DelVar pour nettoyer les variables
- Return pour revenir au programme principal
- Goto pour retour au menu

### Test 6 : Menu avec conditions

```basic
PROGRAM:MENUIF
:0→S
:Lbl 0
:Menu("SCORE","AJOUTER",1,"SOUSTRAIRE",2,"VOIR",3,"RESET",4,"QUIT",9)
:
:Lbl 1
:Input "POINTS:",P
:S+P→S
:Goto 0
:
:Lbl 2
:Input "POINTS:",P
:S-P→S
:If S<0
:0→S
:Goto 0
:
:Lbl 3
:Disp "SCORE=",S
:Pause
:Goto 0
:
:Lbl 4
:0→S
:Disp "RESET OK"
:Pause
:Goto 0
:
:Lbl 9
:Disp "SCORE FINAL:",S
:Stop
```

**Fonctionnalités démontrées :**
- Menu avec plusieurs options
- Variables persistantes entre appels
- Conditions If avec variables modifiées
- Pause pour affichage

## État d'avancement Phase 5

### ✅ Complété
- [x] DelVar (suppression de variable)
- [x] ClrList (préparation, implémentation basique)
- [x] prgm (appel de sous-programme avec Return)
- [x] Menu (menu interactif avec sélection)
- [x] UI pour Menu dans ProgramOutput
- [x] Gestion de la stack d'appels
- [x] Variables globales entre programmes

### 📊 Fonctionnalités supportées

**Navigation :**
- Lbl / Goto ✓
- prgm / Return ✓
- Menu ✓

**Variables :**
- Assignment (→) ✓
- DelVar ✓
- Variables globales ✓

**Structures de contrôle :**
- If/Then/Else/End ✓
- For loops ✓
- While loops ✓
- Repeat loops ✓

**I/O :**
- Input ✓
- Prompt ✓
- Disp ✓
- Output ✓
- ClrHome ✓

**Contrôle d'exécution :**
- Stop ✓
- Pause ✓
- Return ✓

## Notes techniques

### Architecture prgm
- Les lignes de tous les programmes sont chargées dans `context.programLines`
- Quand `prgm NOM` est rencontré, on empile la frame actuelle
- Le sous-programme est exécuté de manière récursive avec `executeProgram`
- Les variables sont globales et partagées entre programmes
- Return dépile la stack et revient au programme appelant

### Architecture Menu
- Menu parse les paramètres (titre + paires option/label)
- Affiche les options dans l'output
- Marque le contexte comme `isWaitingMenu`
- L'UI affiche des boutons pour chaque option
- Quand l'utilisateur sélectionne, fait un Goto vers le label

### Compatibilité TI-83 Plus
- Syntaxe identique à la TI-83 Plus
- Comportement des variables globales conforme
- Menu interactif fonctionnel
- Stack d'appels pour sous-programmes

## Prochaines étapes

La **Phase 6** ajoutera :
1. Tests unitaires de l'interpréteur
2. Tests d'intégration avec programmes complexes
3. Documentation complète
4. Exemples dans l'aide intégrée
5. Optimisations de performance
