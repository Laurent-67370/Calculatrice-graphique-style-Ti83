// Module de statistiques pour TI-83 Plus
class StatisticsModule {
    constructor(calculator) {
        this.calculator = calculator;
        this.currentList = 'L1';
        this.currentIndex = 0;
        this.statVars = {
            n: 0,      // Nombre d'éléments
            mean: 0,   // Moyenne (x̄)
            sum: 0,    // Somme (Σx)
            sumSq: 0,  // Somme des carrés (Σx²)
            stdDev: 0, // Écart-type (Sx)
            stdDevPop: 0, // Écart-type population (σx)
            min: 0,    // Minimum
            max: 0,    // Maximum
            median: 0, // Médiane
            Q1: 0,     // Premier quartile
            Q3: 0      // Troisième quartile
        };
        this.regressionData = null;
    }

    // Éditeur de listes
    openListEditor(listName = 'L1') {
        this.currentList = listName;
        this.calculator.currentMode = 'STAT_EDIT';
        this.displayListEditor();
    }

    displayListEditor() {
        const list = this.calculator.lists[this.currentList];
        let display = `${this.currentList}\n`;
        display += '─────────\n';

        for (let i = 0; i < Math.max(list.length + 1, 6); i++) {
            const value = list[i] !== undefined ? list[i] : '';
            const marker = i === this.currentIndex ? '►' : ' ';
            display += `${marker}${i + 1}: ${value}\n`;
        }

        this.calculator.currentInput = display;
        this.calculator.updateDisplay();
    }

    // Ajouter une valeur à la liste courante
    addToList(value) {
        const list = this.calculator.lists[this.currentList];
        if (this.currentIndex === list.length) {
            list.push(parseFloat(value));
        } else {
            list[this.currentIndex] = parseFloat(value);
        }
        this.currentIndex++;
        this.displayListEditor();
    }

    // Supprimer un élément de la liste
    deleteFromList(index) {
        const list = this.calculator.lists[this.currentList];
        if (index >= 0 && index < list.length) {
            list.splice(index, 1);
            this.displayListEditor();
        }
    }

    // Effacer toute une liste
    clearList(listName) {
        this.calculator.lists[listName] = [];
        this.displayListEditor();
    }

    // Calculer les statistiques à une variable
    calculate1VarStats(listName = 'L1') {
        const list = this.calculator.lists[listName];
        if (list.length === 0) {
            return { error: 'Liste vide' };
        }

        const n = list.length;
        const sum = list.reduce((a, b) => a + b, 0);
        const mean = sum / n;
        const sumSq = list.reduce((a, b) => a + b * b, 0);

        // Écart-type échantillon
        const variance = (sumSq - (sum * sum) / n) / (n - 1);
        const stdDev = Math.sqrt(variance);

        // Écart-type population
        const variancePop = (sumSq - (sum * sum) / n) / n;
        const stdDevPop = Math.sqrt(variancePop);

        const sorted = [...list].sort((a, b) => a - b);
        const min = sorted[0];
        const max = sorted[n - 1];

        // Médiane
        let median;
        if (n % 2 === 0) {
            median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
        } else {
            median = sorted[Math.floor(n / 2)];
        }

        // Quartiles
        const Q1 = this.calculateQuartile(sorted, 0.25);
        const Q3 = this.calculateQuartile(sorted, 0.75);

        this.statVars = {
            n, mean, sum, sumSq, stdDev, stdDevPop, min, max, median, Q1, Q3
        };

        return this.statVars;
    }

    calculateQuartile(sortedArray, percentile) {
        const index = percentile * (sortedArray.length - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index - lower;

        if (upper >= sortedArray.length) return sortedArray[lower];
        return sortedArray[lower] * (1 - weight) + sortedArray[upper] * weight;
    }

    // Calculer les statistiques à deux variables
    calculate2VarStats(listX = 'L1', listY = 'L2') {
        const xList = this.calculator.lists[listX];
        const yList = this.calculator.lists[listY];

        if (xList.length === 0 || yList.length === 0) {
            return { error: 'Liste(s) vide(s)' };
        }

        const n = Math.min(xList.length, yList.length);
        const sumX = xList.slice(0, n).reduce((a, b) => a + b, 0);
        const sumY = yList.slice(0, n).reduce((a, b) => a + b, 0);
        const meanX = sumX / n;
        const meanY = sumY / n;

        let sumXY = 0;
        let sumX2 = 0;
        let sumY2 = 0;

        for (let i = 0; i < n; i++) {
            sumXY += xList[i] * yList[i];
            sumX2 += xList[i] * xList[i];
            sumY2 += yList[i] * yList[i];
        }

        return {
            n, meanX, meanY, sumX, sumY, sumXY, sumX2, sumY2
        };
    }

    // Régression linéaire (y = ax + b)
    linearRegression(listX = 'L1', listY = 'L2') {
        const stats = this.calculate2VarStats(listX, listY);
        if (stats.error) return stats;

        const { n, meanX, meanY, sumX, sumY, sumXY, sumX2 } = stats;

        // Calcul de la pente (a) et l'ordonnée à l'origine (b)
        const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const b = meanY - a * meanX;

        // Coefficient de corrélation (r)
        const sumY2 = stats.sumY2;
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        const r = numerator / denominator;
        const r2 = r * r; // Coefficient de détermination

        this.regressionData = {
            type: 'linear',
            equation: `y=${a.toFixed(6)}x+${b.toFixed(6)}`,
            a, b, r, r2,
            predict: (x) => a * x + b
        };

        return this.regressionData;
    }

    // Régression quadratique (y = ax² + bx + c)
    quadraticRegression(listX = 'L1', listY = 'L2') {
        const xList = this.calculator.lists[listX];
        const yList = this.calculator.lists[listY];
        const n = Math.min(xList.length, yList.length);

        if (n < 3) {
            return { error: 'Au moins 3 points requis' };
        }

        // Calculer les sommes nécessaires
        let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
        let sumY = 0, sumXY = 0, sumX2Y = 0;

        for (let i = 0; i < n; i++) {
            const x = xList[i];
            const y = yList[i];
            sumX += x;
            sumX2 += x * x;
            sumX3 += x * x * x;
            sumX4 += x * x * x * x;
            sumY += y;
            sumXY += x * y;
            sumX2Y += x * x * y;
        }

        // Résoudre le système d'équations (méthode des moindres carrés)
        // [sumX4  sumX3  sumX2] [a]   [sumX2Y]
        // [sumX3  sumX2  sumX ] [b] = [sumXY ]
        // [sumX2  sumX   n    ] [c]   [sumY  ]

        const det = n * (sumX2 * sumX4 - sumX3 * sumX3) -
                    sumX * (sumX * sumX4 - sumX2 * sumX3) +
                    sumX2 * (sumX * sumX3 - sumX2 * sumX2);

        if (Math.abs(det) < 1e-10) {
            return { error: 'Système singulier' };
        }

        const a = ((n * sumX2 - sumX * sumX) * sumX2Y - (n * sumX3 - sumX * sumX2) * sumXY + (sumX2 * sumX2 - sumX * sumX3) * sumY) / det;
        const b = ((sumX2 * sumX3 - sumX * sumX4) * sumY - (n * sumX4 - sumX2 * sumX2) * sumXY + (n * sumX3 - sumX * sumX2) * sumX2Y) / det;
        const c = ((sumX * sumX3 - sumX2 * sumX2) * sumXY - (sumX * sumX2 - n * sumX3) * sumX2Y + (n * sumX2 - sumX * sumX) * sumY) / det;

        this.regressionData = {
            type: 'quadratic',
            equation: `y=${a.toFixed(6)}x²+${b.toFixed(6)}x+${c.toFixed(6)}`,
            a, b, c,
            predict: (x) => a * x * x + b * x + c
        };

        return this.regressionData;
    }

    // Régression exponentielle (y = ab^x)
    exponentialRegression(listX = 'L1', listY = 'L2') {
        const xList = this.calculator.lists[listX];
        const yList = this.calculator.lists[listY];
        const n = Math.min(xList.length, yList.length);

        // Vérifier que toutes les valeurs y sont positives
        for (let i = 0; i < n; i++) {
            if (yList[i] <= 0) {
                return { error: 'Toutes les valeurs Y doivent être positives' };
            }
        }

        // Transformer en régression linéaire: ln(y) = ln(a) + x*ln(b)
        const lnYList = yList.slice(0, n).map(y => Math.log(y));

        // Utiliser la régression linéaire sur (x, ln(y))
        const sumX = xList.slice(0, n).reduce((a, b) => a + b, 0);
        const sumLnY = lnYList.reduce((a, b) => a + b, 0);
        const meanX = sumX / n;
        const meanLnY = sumLnY / n;

        let sumXLnY = 0;
        let sumX2 = 0;

        for (let i = 0; i < n; i++) {
            sumXLnY += xList[i] * lnYList[i];
            sumX2 += xList[i] * xList[i];
        }

        const lnB = (n * sumXLnY - sumX * sumLnY) / (n * sumX2 - sumX * sumX);
        const lnA = meanLnY - lnB * meanX;

        const a = Math.exp(lnA);
        const b = Math.exp(lnB);

        // Calculer r²
        let ssRes = 0, ssTot = 0;
        for (let i = 0; i < n; i++) {
            const predicted = a * Math.pow(b, xList[i]);
            ssRes += Math.pow(yList[i] - predicted, 2);
            ssTot += Math.pow(yList[i] - sumY / n, 2);
        }
        const r2 = 1 - (ssRes / ssTot);

        this.regressionData = {
            type: 'exponential',
            equation: `y=${a.toFixed(6)}·${b.toFixed(6)}^x`,
            a, b, r2,
            predict: (x) => a * Math.pow(b, x)
        };

        return this.regressionData;
    }

    // Régression logarithmique (y = a + b*ln(x))
    logarithmicRegression(listX = 'L1', listY = 'L2') {
        const xList = this.calculator.lists[listX];
        const yList = this.calculator.lists[listY];
        const n = Math.min(xList.length, yList.length);

        // Vérifier que toutes les valeurs x sont positives
        for (let i = 0; i < n; i++) {
            if (xList[i] <= 0) {
                return { error: 'Toutes les valeurs X doivent être positives' };
            }
        }

        // Transformer: y = a + b*ln(x)
        const lnXList = xList.slice(0, n).map(x => Math.log(x));

        const sumLnX = lnXList.reduce((a, b) => a + b, 0);
        const sumY = yList.slice(0, n).reduce((a, b) => a + b, 0);
        const meanLnX = sumLnX / n;
        const meanY = sumY / n;

        let sumLnXY = 0;
        let sumLnX2 = 0;

        for (let i = 0; i < n; i++) {
            sumLnXY += lnXList[i] * yList[i];
            sumLnX2 += lnXList[i] * lnXList[i];
        }

        const b = (n * sumLnXY - sumLnX * sumY) / (n * sumLnX2 - sumLnX * sumLnX);
        const a = meanY - b * meanLnX;

        this.regressionData = {
            type: 'logarithmic',
            equation: `y=${a.toFixed(6)}+${b.toFixed(6)}·ln(x)`,
            a, b,
            predict: (x) => a + b * Math.log(x)
        };

        return this.regressionData;
    }

    // Régression puissance (y = ax^b)
    powerRegression(listX = 'L1', listY = 'L2') {
        const xList = this.calculator.lists[listX];
        const yList = this.calculator.lists[listY];
        const n = Math.min(xList.length, yList.length);

        // Vérifier que toutes les valeurs sont positives
        for (let i = 0; i < n; i++) {
            if (xList[i] <= 0 || yList[i] <= 0) {
                return { error: 'Toutes les valeurs doivent être positives' };
            }
        }

        // Transformer: ln(y) = ln(a) + b*ln(x)
        const lnXList = xList.slice(0, n).map(x => Math.log(x));
        const lnYList = yList.slice(0, n).map(y => Math.log(y));

        const sumLnX = lnXList.reduce((a, b) => a + b, 0);
        const sumLnY = lnYList.reduce((a, b) => a + b, 0);
        const meanLnX = sumLnX / n;
        const meanLnY = sumLnY / n;

        let sumLnXLnY = 0;
        let sumLnX2 = 0;

        for (let i = 0; i < n; i++) {
            sumLnXLnY += lnXList[i] * lnYList[i];
            sumLnX2 += lnXList[i] * lnXList[i];
        }

        const b = (n * sumLnXLnY - sumLnX * sumLnY) / (n * sumLnX2 - sumLnX * sumLnX);
        const lnA = meanLnY - b * meanLnX;
        const a = Math.exp(lnA);

        this.regressionData = {
            type: 'power',
            equation: `y=${a.toFixed(6)}·x^${b.toFixed(6)}`,
            a, b,
            predict: (x) => a * Math.pow(x, b)
        };

        return this.regressionData;
    }

    // Afficher les résultats de statistiques
    displayStats(stats) {
        let display = '1-Var Stats\n';
        display += '─────────\n';
        display += `n = ${stats.n}\n`;
        display += `x̄ = ${stats.mean.toFixed(6)}\n`;
        display += `Σx = ${stats.sum.toFixed(6)}\n`;
        display += `Σx² = ${stats.sumSq.toFixed(6)}\n`;
        display += `Sx = ${stats.stdDev.toFixed(6)}\n`;
        display += `σx = ${stats.stdDevPop.toFixed(6)}\n`;
        display += `min = ${stats.min}\n`;
        display += `max = ${stats.max}\n`;
        display += `Med = ${stats.median}\n`;
        display += `Q₁ = ${stats.Q1}\n`;
        display += `Q₃ = ${stats.Q3}\n`;

        this.calculator.currentInput = display;
        this.calculator.updateDisplay();
    }

    // Menu STAT principal
    showStatMenu() {
        const menu = [
            '1: Edit...',
            '2: SortA(',
            '3: SortD(',
            '4: ClrList',
            '5: SetUpEditor'
        ];

        this.calculator.showMenu('STAT', menu, (choice) => {
            switch(choice) {
                case 1:
                    this.openListEditor('L1');
                    break;
                case 2:
                    this.sortList(this.currentList, 'asc');
                    break;
                case 3:
                    this.sortList(this.currentList, 'desc');
                    break;
                case 4:
                    this.clearList(this.currentList);
                    break;
            }
        });
    }

    // Sous-menu CALC
    showCalcMenu() {
        const menu = [
            '1: 1-Var Stats',
            '2: 2-Var Stats',
            '3: Med-Med',
            '4: LinReg(ax+b)',
            '5: QuadReg',
            '6: CubicReg',
            '7: QuartReg',
            '8: LinReg(a+bx)',
            '9: LnReg',
            '0: ExpReg',
            'A: PwrReg'
        ];

        this.calculator.showMenu('STAT CALC', menu, (choice) => {
            switch(choice) {
                case 1:
                    const stats = this.calculate1VarStats('L1');
                    this.displayStats(stats);
                    break;
                case 4:
                    const linReg = this.linearRegression('L1', 'L2');
                    this.calculator.currentInput = linReg.equation;
                    break;
                case 5:
                    const quadReg = this.quadraticRegression('L1', 'L2');
                    this.calculator.currentInput = quadReg.equation || quadReg.error;
                    break;
                case 9:
                    const lnReg = this.logarithmicRegression('L1', 'L2');
                    this.calculator.currentInput = lnReg.equation || lnReg.error;
                    break;
                case 0:
                    const expReg = this.exponentialRegression('L1', 'L2');
                    this.calculator.currentInput = expReg.equation || expReg.error;
                    break;
                case 'A':
                    const pwrReg = this.powerRegression('L1', 'L2');
                    this.calculator.currentInput = pwrReg.equation || pwrReg.error;
                    break;
            }
            this.calculator.updateDisplay();
        });
    }

    // Trier une liste
    sortList(listName, order = 'asc') {
        const list = this.calculator.lists[listName];
        if (order === 'asc') {
            list.sort((a, b) => a - b);
        } else {
            list.sort((a, b) => b - a);
        }
        this.displayListEditor();
    }
}
