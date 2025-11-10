# Tests Phase 4 - Navigation avec Lbl et Goto

## Fonctionnalités implémentées

### ✅ Commandes de navigation
- **Lbl** : Définir un label
- **Goto** : Sauter à un label
- **Return** : Retourner d'un sous-programme

## Programmes de test

### Test 1 : Goto simple

```basic
PROGRAM:GOTO1
:Disp "DEBUT"
:Goto A
:Disp "JAMAIS AFFICHE"
:Lbl A
:Disp "FIN"
```

**Résultat attendu :**
```
DEBUT
FIN
```

### Test 2 : Menu avec Goto

```basic
PROGRAM:MENU1
:Lbl 0
:ClrHome
:Disp "MENU:"
:Disp "1:AIRE"
:Disp "2:PERIM"
:Disp "3:QUIT"
:Input "CHOIX:",C
:If C=1
:Goto 1
:If C=2
:Goto 2
:If C=3
:Goto 3
:Goto 0
:
:Lbl 1
:Input "RAYON:",R
:π*R²→A
:Disp "AIRE=",A
:Goto 0
:
:Lbl 2
:Input "RAYON:",R
:2*π*R→P
:Disp "PERIM=",P
:Goto 0
:
:Lbl 3
:Disp "AU REVOIR"
:Stop
```

**Résultat attendu :**
- Menu interactif avec 3 options
- Calcul d'aire ou périmètre selon le choix
- Retour au menu après chaque calcul
- Sortie avec option 3

### Test 3 : Boucle avec Goto

```basic
PROGRAM:BOUCLE
:0→X
:Lbl A
:Disp X
:X+1→X
:If X<5
:Goto A
:Disp "FINI"
```

**Résultat attendu :**
```
0
1
2
3
4
FINI
```

### Test 4 : Return (nécessite prgm - à implémenter en Phase 5)

```basic
PROGRAM:MAIN
:Disp "DEBUT"
:prgm SUB1
:Disp "FIN"

PROGRAM:SUB1
:Disp "SOUS-PROG"
:Return
```

**Note :** Cette fonctionnalité nécessite l'implémentation de la commande `prgm` qui sera ajoutée en Phase 5.

## État d'avancement Phase 4

### ✅ Complété
- [x] Input et Prompt avec queue
- [x] Stop
- [x] Pause avec reprise
- [x] Lbl (définition de label)
- [x] Goto (saut vers label)
- [x] Return (retour de sous-programme)
- [x] ProgramRunner UI avec gestion Input/Pause

### 🔜 À venir (Phase 5)
- [ ] prgm (appeler un sous-programme)
- [ ] Menu interactif
- [ ] DelVar
- [ ] ClrList

## Notes techniques

### Architecture
- Les labels sont scannés au début de l'exécution du programme
- Un dictionnaire `labels` associe chaque nom de label à son numéro de ligne
- La commande Goto utilise `context.gotoLine` pour signaler un saut
- La commande Return dépile la stack et retourne à la ligne d'appel

### Compatibilité TI-83 Plus
- Syntaxe : `Lbl A` (labels alphanumériques et θ supportés)
- Syntaxe : `Goto A`
- Syntaxe : `Return`
- Comportement identique à la TI-83 Plus

## Prochaines étapes

La **Phase 5** ajoutera :
1. Appel de sous-programmes avec `prgm`
2. Menu interactif avec `Menu()`
3. Gestion avancée des variables (DelVar)
4. Tests complets avec programmes complexes
