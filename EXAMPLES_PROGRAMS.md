# 📚 Collection de Programmes Exemples TI-BASIC

**Version 3.0.0.0** - Programmation TI-BASIC complète

Cette collection contient des programmes exemples pour apprendre et tester les fonctionnalités de programmation TI-BASIC de la calculatrice.

---

## 🎓 Niveau Débutant

### 1. Hello World

Le programme le plus simple pour débuter.

```basic
PROGRAM:HELLO
:Disp "HELLO WORLD"
:Disp "BIENVENUE!"
:Pause
```

### 2. Addition Simple

Demande deux nombres et affiche leur somme.

```basic
PROGRAM:ADDITION
:Input "A=",A
:Input "B=",B
:A+B→S
:Disp "SOMME=",S
```

### 3. Aire d'un Cercle

Calcule l'aire d'un cercle à partir du rayon.

```basic
PROGRAM:AIRE
:Input "RAYON:",R
:π*R²→A
:Disp "AIRE=",A
:Pause
```

### 4. Boucle Simple

Affiche les nombres de 1 à 10.

```basic
PROGRAM:COMPTE
:For(I,1,10)
:Disp I
:End
:Disp "TERMINE!"
```

### 5. Pair ou Impair

Teste si un nombre est pair ou impair.

```basic
PROGRAM:PAIRIMPAR
:Input "NOMBRE:",N
:If fPart(N/2)=0
:Then
:Disp "PAIR"
:Else
:Disp "IMPAIR"
:End
```

---

## 🎯 Niveau Intermédiaire

### 6. Factorielle

Calcule la factorielle d'un nombre.

```basic
PROGRAM:FACT
:Input "N=",N
:1→F
:For(I,1,N)
:F*I→F
:End
:Disp "N!=",F
```

### 7. Suite de Fibonacci

Calcule les N premiers termes de la suite de Fibonacci.

```basic
PROGRAM:FIBO
:Input "TERMES:",N
:0→A
:1→B
:For(I,1,N)
:Disp A
:A+B→C
:B→A
:C→B
:End
```

### 8. Conversion Température

Convertit Celsius en Fahrenheit.

```basic
PROGRAM:TEMPCONV
:ClrHome
:Lbl 0
:Menu("TEMPERATURE","C→F",1,"F→C",2,"QUIT",9)
:
:Lbl 1
:Input "CELSIUS:",C
:9*C/5+32→F
:Disp "FAHRENHEIT:",F
:Pause
:Goto 0
:
:Lbl 2
:Input "FAHRENHEIT:",F
:(F-32)*5/9→C
:Disp "CELSIUS:",C
:Pause
:Goto 0
:
:Lbl 9
:Stop
```

### 9. Moyenne et Écart-Type

Calcule la moyenne de N nombres.

```basic
PROGRAM:MOYENNE
:Input "COMBIEN:",N
:0→S
:For(I,1,N)
:Input "VALEUR:",V
:S+V→S
:End
:S/N→M
:Disp "MOYENNE=",M
```

### 10. Nombre Premier

Teste si un nombre est premier.

```basic
PROGRAM:PREMIER
:Input "N=",N
:If N<2
:Then
:Disp "NON PREMIER"
:Stop
:End
:1→P
:For(I,2,√(N))
:If fPart(N/I)=0
:0→P
:End
:If P=1
:Then
:Disp "PREMIER"
:Else
:Disp "NON PREMIER"
:End
```

---

## 🚀 Niveau Avancé

### 11. Calculatrice avec Menu et Sous-programmes

**Programme principal :**
```basic
PROGRAM:CALC
:ClrHome
:Lbl 0
:Menu("CALCULATRICE","ADDITION",1,"MULTIPLICATION",2,"PUISSANCE",3,"FACTORIELLE",4,"QUIT",9)
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
:Lbl 4
:prgm FACTCALC
:Goto 0
:
:Lbl 9
:Disp "AU REVOIR!"
:Stop
```

**Sous-programme Addition (ADD) :**
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

**Sous-programme Multiplication (MULT) :**
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

**Sous-programme Puissance (POW) :**
```basic
PROGRAM:POW
:Input "BASE=",A
:Input "EXPOSANT=",B
:A^B→R
:Disp "RESULTAT=",R
:Pause
:DelVar A
:DelVar B
:DelVar R
:Return
```

**Sous-programme Factorielle (FACTCALC) :**
```basic
PROGRAM:FACTCALC
:Input "N=",N
:1→F
:For(I,1,N)
:F*I→F
:End
:Disp "N!=",F
:Pause
:DelVar N
:DelVar F
:DelVar I
:Return
```

### 12. Jeu du Plus ou Moins

```basic
PROGRAM:PLUSMOINS
:ClrHome
:Disp "JEU PLUS OU MOINS"
:Pause
:rand*100→S
:int(S)+1→S
:0→T
:Lbl A
:T+1→T
:Input "ESSAI:",G
:If G=S
:Goto B
:If G<S
:Disp "PLUS GRAND!"
:If G>S
:Disp "PLUS PETIT!"
:Goto A
:Lbl B
:ClrHome
:Disp "GAGNE!"
:Disp "ESSAIS:",T
:Stop
```

### 13. Résolution Équation 2nd Degré

```basic
PROGRAM:EQUA2
:Input "A=",A
:Input "B=",B
:Input "C=",C
:B²-4*A*C→D
:If D<0
:Then
:Disp "PAS DE SOLUTION"
:Stop
:End
:If D=0
:Then
:-B/(2*A)→X
:Disp "X=",X
:Stop
:End
:(-B+√(D))/(2*A)→X1
:(-B-√(D))/(2*A)→X2
:Disp "X1=",X1
:Disp "X2=",X2
```

### 14. Système de Score avec Menu

```basic
PROGRAM:SCORE
:0→S
:Lbl 0
:ClrHome
:Disp "SCORE:",S
:Menu("OPTIONS","AJOUTER",1,"SOUSTRAIRE",2,"DOUBLER",3,"RESET",4,"QUIT",9)
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
:2*S→S
:Disp "SCORE DOUBLE!"
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
:ClrHome
:Disp "SCORE FINAL:"
:Disp S
:Stop
```

### 15. Approximation de π (Méthode Monte Carlo)

```basic
PROGRAM:PIAPPROX
:Input "ESSAIS:",N
:0→C
:For(I,1,N)
:rand→X
:rand→Y
:If X²+Y²≤1
:C+1→C
:End
:4*C/N→P
:Disp "PI≈",P
:Disp "ERREUR:"
:Disp abs(π-P)
```

---

## 🎮 Projets Complets

### 16. Gestionnaire de Notes

**Programme principal (NOTES) :**
```basic
PROGRAM:NOTES
:0→N
:0→S
:Lbl 0
:ClrHome
:If N>0
:Then
:Disp "NOTES:",N
:Disp "MOYENNE:",S/N
:Else
:Disp "AUCUNE NOTE"
:End
:Menu("GESTION","AJOUTER",1,"VOIR",2,"RESET",3,"QUIT",9)
:
:Lbl 1
:Input "NOTE:",V
:If V<0 or V>20
:Then
:Disp "NOTE INVALIDE"
:Pause
:Goto 0
:End
:S+V→S
:N+1→N
:Goto 0
:
:Lbl 2
:If N=0
:Then
:Disp "AUCUNE NOTE"
:Pause
:Goto 0
:End
:Disp "NOTES:",N
:Disp "SOMME:",S
:Disp "MOYENNE:",S/N
:Pause
:Goto 0
:
:Lbl 3
:0→N
:0→S
:Disp "RESET OK"
:Pause
:Goto 0
:
:Lbl 9
:Stop
```

### 17. Convertisseur Universel

```basic
PROGRAM:CONVERT
:Lbl 0
:ClrHome
:Menu("CONVERTIR","DISTANCE",1,"POIDS",2,"TEMPERATURE",3,"QUIT",9)
:
:Lbl 1
:prgm CONVDIST
:Goto 0
:
:Lbl 2
:prgm CONVPOIDS
:Goto 0
:
:Lbl 3
:prgm CONVTEMP
:Goto 0
:
:Lbl 9
:Stop
```

**Sous-programme Distance (CONVDIST) :**
```basic
PROGRAM:CONVDIST
:Menu("DISTANCE","KM→MI",1,"MI→KM",2,"M→FT",3,"RETOUR",9)
:
:Lbl 1
:Input "KM:",V
:V*0.621371→R
:Disp "MILES:",R
:Pause
:Return
:
:Lbl 2
:Input "MILES:",V
:V*1.60934→R
:Disp "KM:",R
:Pause
:Return
:
:Lbl 3
:Input "METRES:",V
:V*3.28084→R
:Disp "FEET:",R
:Pause
:Return
:
:Lbl 9
:Return
```

---

## 📝 Notes d'utilisation

### Saisie des programmes
1. Appuyez sur `PRGM` (2ND + MODE en général)
2. Sélectionnez `NEW` ou `EDIT`
3. Entrez le nom du programme (max 8 caractères)
4. Saisissez les lignes de code

### Exécution
1. Appuyez sur `PRGM`
2. Sélectionnez `EXEC`
3. Choisissez le programme à exécuter

### Symboles spéciaux
- `→` : Touche STO (affectation)
- `π` : 2ND + ^
- `²` : x²
- `√` : 2ND + x²
- `≤` : 2ND + MATH
- `≥` : 2ND + MATH

### Commandes importantes
- `Input` : Demander une valeur
- `Disp` : Afficher un texte ou nombre
- `Pause` : Pause avec ENTER pour continuer
- `ClrHome` : Effacer l'écran
- `Stop` : Arrêter le programme

---

## 🎯 Conseils de programmation

1. **Commentaires** : Utilisez `#` au début d'une ligne pour un commentaire
2. **Indentation** : Indentez votre code pour la lisibilité
3. **Variables** : Utilisez des noms de variables significatifs (A-Z, θ)
4. **Test** : Testez votre programme avec différentes valeurs
5. **Optimisation** : Utilisez `DelVar` pour libérer les variables inutiles
6. **Sous-programmes** : Divisez les programmes complexes en sous-programmes
7. **Menus** : Utilisez `Menu()` pour une navigation intuitive

---

## 📚 Ressources

- **Roadmap PRGM** : ROADMAP_PRGM_v3.0.md
- **Tests Phase 4** : TEST_PHASE4.md
- **Tests Phase 5** : TEST_PHASE5.md
- **Guide utilisateur** : PRGM_USER_GUIDE.md

**Compatibilité** : TI-83 Plus (95%)
**Version** : 3.0.0.0
