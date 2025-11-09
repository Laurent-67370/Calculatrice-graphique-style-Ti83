# 📖 Guide Utilisateur - Programmation TI-BASIC

**Version 3.0.0.0** - Calculatrice Graphique style TI-83 Plus

---

## 📑 Table des Matières

1. [Introduction](#introduction)
2. [Premiers Pas](#premiers-pas)
3. [Commandes de Base](#commandes-de-base)
4. [Structures de Contrôle](#structures-de-contrôle)
5. [Navigation](#navigation)
6. [Fonctionnalités Avancées](#fonctionnalités-avancées)
7. [Exemples Pratiques](#exemples-pratiques)
8. [Résolution de Problèmes](#résolution-de-problèmes)

---

## 🎯 Introduction

### Qu'est-ce que TI-BASIC ?

TI-BASIC est le langage de programmation intégré des calculatrices Texas Instruments. Cette calculatrice web implémente une version compatible à 95% avec la TI-83 Plus.

### Capacités

- ✅ Structures de contrôle (If/Then/Else, For, While, Repeat)
- ✅ Navigation (Labels, Goto, sous-programmes)
- ✅ Entrées/Sorties utilisateur (Input, Disp, Output)
- ✅ Menus interactifs
- ✅ Variables (A-Z, θ)
- ✅ Appels de sous-programmes
- ✅ Fonctions mathématiques complètes

---

## 🚀 Premiers Pas

### Créer un Programme

1. **Accéder au menu PRGM**
   - Cliquez sur `PRGM` ou `2ND` + bouton approprié

2. **Sélectionner NEW**
   - Choisissez l'onglet `NEW`
   - Entrez un nom (max 8 caractères, lettres uniquement)
   - Validez

3. **Écrire le code**
   - Tapez votre code ligne par ligne
   - Utilisez le catalogue pour les commandes

4. **Sauvegarder**
   - La sauvegarde est automatique

### Exécuter un Programme

1. **Menu PRGM → EXEC**
2. **Sélectionnez votre programme**
3. **Cliquez pour exécuter**

### Votre Premier Programme

```basic
PROGRAM:HELLO
:Disp "BONJOUR!"
:Input "VOTRE NOM:",N
:Disp "SALUT",N
:Pause
```

---

## 📚 Commandes de Base

### Affichage

#### Disp
Affiche une ou plusieurs valeurs.

```basic
:Disp "TEXTE"           # Affiche du texte
:Disp 42                # Affiche un nombre
:Disp "A=",A            # Affiche texte et variable
:Disp                   # Ligne vide
```

#### Output
Affiche à une position spécifique (ligne, colonne).

```basic
:Output(1,1,"TITRE")    # Ligne 1, colonne 1
:Output(3,5,X)          # Affiche X à (3,5)
```

#### ClrHome
Efface l'écran de sortie.

```basic
:ClrHome
```

### Entrées Utilisateur

#### Input
Demande une valeur à l'utilisateur.

```basic
:Input A                # Simple
:Input "RAYON:",R       # Avec prompt
```

#### Prompt
Demande une ou plusieurs variables.

```basic
:Prompt A               # Demande A
:Prompt A,B,C           # Demande A, B et C
```

### Variables

#### Affectation (→)
Assigne une valeur à une variable.

```basic
:5→A                    # A = 5
:A+10→B                 # B = A + 10
:π*R²→AIRE              # Calcul d'aire
```

#### DelVar
Supprime une variable de la mémoire.

```basic
:DelVar A               # Supprime A
```

### Contrôle d'Exécution

#### Stop
Arrête l'exécution du programme.

```basic
:Stop
```

#### Pause
Pause avec message optionnel.

```basic
:Pause                  # Attend ENTER
:Pause "MESSAGE"        # Affiche et attend
```

---

## 🔀 Structures de Contrôle

### If/Then/Else

#### If simple (une ligne)

```basic
:If X>0
:Disp "POSITIF"
```

#### If/Then/End

```basic
:If X>0
:Then
:Disp "POSITIF"
:X*2→Y
:End
```

#### If/Then/Else/End

```basic
:If X>0
:Then
:Disp "POSITIF"
:Else
:Disp "NEGATIF OU NUL"
:End
```

### Boucles

#### For
Boucle avec compteur.

```basic
:For(I,1,10)            # I de 1 à 10
:Disp I
:End

:For(I,0,100,5)         # I de 0 à 100 par pas de 5
:Disp I
:End
```

#### While
Boucle tant que condition vraie.

```basic
:0→X
:While X<10
:Disp X
:X+1→X
:End
```

#### Repeat
Boucle jusqu'à ce que condition vraie.

```basic
:0→X
:Repeat X≥10
:Disp X
:X+1→X
:End
```

### Comparaisons

- `=` : Égal
- `≠` : Différent
- `<` : Inférieur
- `>` : Supérieur
- `≤` : Inférieur ou égal
- `≥` : Supérieur ou égal

### Opérateurs Logiques

- `and` : ET logique
- `or` : OU logique
- `not` : NON logique

```basic
:If X>0 and X<100
:Disp "ENTRE 0 ET 100"
```

---

## 🧭 Navigation

### Labels et Goto

#### Lbl
Définit un point de référence.

```basic
:Lbl A                  # Label A
:Lbl 1                  # Label 1
:Lbl START              # Label START
```

#### Goto
Saute à un label.

```basic
:Goto A                 # Va au label A
:Goto 1                 # Va au label 1
```

**Exemple complet :**

```basic
:Lbl MENU
:Input "CHOIX:",C
:If C=1
:Goto OPT1
:If C=2
:Goto OPT2
:Goto MENU
:
:Lbl OPT1
:Disp "OPTION 1"
:Goto MENU
:
:Lbl OPT2
:Disp "OPTION 2"
:Goto MENU
```

### Sous-programmes

#### prgm
Appelle un autre programme.

```basic
:prgm CALCUL            # Appelle CALCUL
:Disp "RETOUR"          # Après le Return
```

#### Return
Retourne au programme appelant.

```basic
PROGRAM:CALCUL
:Input "X:",X
:X²→Y
:Disp "Y=",Y
:Return                 # Retour
```

**Variables globales :**
Les variables sont partagées entre tous les programmes.

```basic
PROGRAM:MAIN
:5→X
:prgm SUB
:Disp X                 # X modifié par SUB

PROGRAM:SUB
:X*2→X                  # Modifie X
:Return
```

---

## 🎨 Fonctionnalités Avancées

### Menu Interactif

Crée un menu avec sélection par boutons.

**Syntaxe :**
```basic
:Menu("TITRE","OPT1",LBL1,"OPT2",LBL2,...)
```

**Exemple :**

```basic
PROGRAM:MENUDEMO
:Lbl 0
:Menu("OPERATIONS","ADDITION",1,"MULTIPLICATION",2,"QUITTER",9)
:
:Lbl 1
:Input "A:",A
:Input "B:",B
:Disp "SOMME=",A+B
:Pause
:Goto 0
:
:Lbl 2
:Input "A:",A
:Input "B:",B
:Disp "PRODUIT=",A*B
:Pause
:Goto 0
:
:Lbl 9
:Stop
```

### Gestion des Erreurs

**Types d'erreurs :**

- `ERR:SYNTAX` : Erreur de syntaxe
- `ERR:LABEL` : Label introuvable
- `ERR:UNDEFINED` : Programme non trouvé
- `ERR:NO END` : End manquant

**Prévention :**
- Vérifiez la syntaxe
- Testez avec des valeurs simples
- Utilisez des commentaires (`#`)
- Indentez votre code

---

## 💡 Exemples Pratiques

### Calculatrice Simple

```basic
PROGRAM:CALC
:ClrHome
:Lbl 0
:Menu("CALCULATRICE","ADD",1,"MULT",2,"DIV",3,"QUIT",9)
:
:Lbl 1
:Input "A:",A
:Input "B:",B
:Disp "RESULTAT:",A+B
:Pause
:Goto 0
:
:Lbl 2
:Input "A:",A
:Input "B:",B
:Disp "RESULTAT:",A*B
:Pause
:Goto 0
:
:Lbl 3
:Input "A:",A
:Input "B:",B
:If B=0
:Then
:Disp "ERR:DIV PAR 0"
:Pause
:Goto 0
:End
:Disp "RESULTAT:",A/B
:Pause
:Goto 0
:
:Lbl 9
:Stop
```

### Table de Multiplication

```basic
PROGRAM:TABLE
:Input "TABLE DE:",N
:ClrHome
:For(I,1,10)
:Disp N,"×",I,"=",N*I
:End
:Pause
```

### Jeu de Devinette

```basic
PROGRAM:DEVINE
:ClrHome
:Disp "DEVINEZ (1-100)"
:rand*100→S
:int(S)+1→S
:0→T
:
:Lbl A
:T+1→T
:Input "ESSAI:",G
:
:If G=S
:Goto WIN
:
:If G<S
:Disp "PLUS GRAND!"
:
:If G>S
:Disp "PLUS PETIT!"
:
:Goto A
:
:Lbl WIN
:ClrHome
:Disp "BRAVO!"
:Disp "ESSAIS:",T
:Stop
```

---

## 🔧 Résolution de Problèmes

### Le programme ne s'exécute pas

**Causes possibles :**
1. Erreur de syntaxe
2. Label manquant
3. End manquant

**Solutions :**
- Relisez le code ligne par ligne
- Vérifiez les paires If/End, For/End, While/End
- Vérifiez que tous les labels existent

### Les variables ne fonctionnent pas

**Problème :** Variable indéfinie

**Solution :**
- Initialisez vos variables avant utilisation
- Vérifiez l'orthographe (sensible à la casse)

### Le menu ne s'affiche pas

**Problème :** Syntaxe Menu incorrecte

**Solution :**
```basic
# Correct :
:Menu("TITRE","OPT1",1,"OPT2",2)

# Incorrect :
:Menu(TITRE,OPT1,1,OPT2,2)  # Manque guillemets
```

### Boucle infinie

**Problème :** Condition jamais fausse

**Solutions :**
- Vérifiez la condition de sortie
- Ajoutez un compteur de sécurité
- Utilisez Stop pour forcer l'arrêt

---

## 📊 Bonnes Pratiques

### 1. Structure du Code

```basic
# ✅ Bon
PROGRAM:EXEMPLE
:ClrHome
:Input "X:",X
:If X>0
:Then
:Disp "POSITIF"
:Else
:Disp "NEGATIF"
:End
:Stop

# ❌ Mauvais
PROGRAM:EXEMPLE
:Input "X:",X
:If X>0
:Disp "POSITIF"
# Manque structure claire
```

### 2. Nommage

- **Variables** : Courtes et significatives (A, B, X, Y, N, T)
- **Programmes** : Descriptifs (CALC, MENU, FACT)
- **Labels** : Clairs (START, MENU, WIN, QUIT)

### 3. Organisation

```basic
# En-tête
PROGRAM:NOM
:ClrHome

# Initialisation
:0→SCORE

# Menu principal
:Lbl MENU
:Menu(...)

# Sections
:Lbl SECTION1
:# Code...
:Goto MENU

# Fin
:Lbl QUIT
:Stop
```

### 4. Optimisation

- Utilisez `DelVar` pour libérer la mémoire
- Évitez les Goto excessifs
- Préférez les sous-programmes pour le code répétitif
- Utilisez des menus pour la navigation

---

## 🎓 Ressources

### Fichiers de Documentation

- **EXAMPLES_PROGRAMS.md** : 17 programmes exemples
- **TEST_PHASE4.md** : Tests navigation et I/O
- **TEST_PHASE5.md** : Tests fonctionnalités avancées
- **ROADMAP_PRGM_v3.0.md** : Feuille de route complète

### Commandes Disponibles

**Affichage :**
- Disp, Output, ClrHome

**Entrées :**
- Input, Prompt

**Variables :**
- → (affectation), DelVar

**Structures :**
- If/Then/Else/End
- For/End
- While/End
- Repeat/End

**Navigation :**
- Lbl, Goto
- prgm, Return
- Menu
- Stop, Pause

---

## 📝 Aide-Mémoire Rapide

### Symboles Courants

```
→   Affectation (STO)
π   Pi (2ND + ^)
²   Carré (x²)
√   Racine (2ND + x²)
≤   Inférieur ou égal
≥   Supérieur ou égal
≠   Différent
```

### Structure Type

```basic
PROGRAM:NOM
:ClrHome
:# Initialisation
:0→VAR

:# Boucle principale
:Lbl MENU
:Menu("TITRE","OPT",1,"QUIT",9)

:# Option
:Lbl 1
:# Code
:Goto MENU

:# Sortie
:Lbl 9
:Stop
```

---

**Version :** 3.0.0.0
**Compatibilité :** TI-83 Plus (95%)
**Dernière mise à jour :** 2025
