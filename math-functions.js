// Module de fonctions mathématiques avancées pour TI-83 Plus
class MathFunctionsModule {
    constructor(calculator) {
        this.calculator = calculator;
    }

    // ============= MENU MATH =============

    showMathMenu() {
        const menu = [
            'MATH NUM CPX PRB',
            '1: ►Frac',
            '2: ►Dec',
            '3: ³√(',
            '4: ³√(',
            '5: x√(',
            '6: fMin(',
            '7: fMax(',
            '8: nDeriv(',
            '9: fnInt(',
            '0: solver'
        ];

        this.calculator.showMenu('MATH', menu, (choice) => {
            switch(choice) {
                case 1:
                    this.toFraction();
                    break;
                case 2:
                    this.toDecimal();
                    break;
                case 3:
                case 4:
                    this.calculator.inputFunction('∛(');
                    break;
                case 8:
                    this.calculator.inputFunction('nDeriv(');
                    break;
                case 9:
                    this.calculator.inputFunction('fnInt(');
                    break;
            }
        });
    }

    // ============= NUM (Fonctions numériques) =============

    showNumMenu() {
        const menu = [
            'NUM',
            '1: abs(',
            '2: round(',
            '3: iPart(',
            '4: fPart(',
            '5: int(',
            '6: min(',
            '7: max(',
            '8: lcm(',
            '9: gcd(',
            '0: remainder('
        ];

        this.calculator.showMenu('MATH NUM', menu, (choice) => {
            const functions = {
                1: 'abs(',
                2: 'round(',
                3: 'iPart(',
                4: 'fPart(',
                5: 'int(',
                6: 'min(',
                7: 'max(',
                8: 'lcm(',
                9: 'gcd('
            };
            if (functions[choice]) {
                this.calculator.inputFunction(functions[choice]);
            }
        });
    }

    // Convertir en fraction
    toFraction() {
        const value = parseFloat(this.calculator.currentInput);
        if (isNaN(value)) return;

        const fraction = this.decimalToFraction(value);
        this.calculator.currentInput = `${fraction.numerator}/${fraction.denominator}`;
        this.calculator.updateDisplay();
    }

    decimalToFraction(decimal, tolerance = 1e-6) {
        let numerator = 1;
        let denominator = 1;
        let error = Math.abs(decimal - numerator / denominator);

        for (let d = 1; d <= 10000; d++) {
            const n = Math.round(decimal * d);
            const currentError = Math.abs(decimal - n / d);

            if (currentError < error) {
                numerator = n;
                denominator = d;
                error = currentError;

                if (error < tolerance) break;
            }
        }

        // Simplifier la fraction
        const gcd = this.gcd(Math.abs(numerator), Math.abs(denominator));
        return {
            numerator: numerator / gcd,
            denominator: denominator / gcd
        };
    }

    // Convertir en décimal
    toDecimal() {
        // Si l'entrée est une fraction, la convertir
        const fractionMatch = this.calculator.currentInput.match(/(-?\d+)\/(-?\d+)/);
        if (fractionMatch) {
            const result = parseFloat(fractionMatch[1]) / parseFloat(fractionMatch[2]);
            this.calculator.currentInput = result.toString();
            this.calculator.updateDisplay();
        }
    }

    // Partie entière
    iPart(x) {
        return Math.trunc(x);
    }

    // Partie fractionnaire
    fPart(x) {
        return x - Math.trunc(x);
    }

    // Plus grand entier inférieur ou égal
    int(x) {
        return Math.floor(x);
    }

    // Minimum
    min(...args) {
        return Math.min(...args);
    }

    // Maximum
    max(...args) {
        return Math.max(...args);
    }

    // Plus petit commun multiple (LCM)
    lcm(a, b) {
        return Math.abs(a * b) / this.gcd(a, b);
    }

    // Plus grand commun diviseur (GCD)
    gcd(a, b) {
        a = Math.abs(Math.round(a));
        b = Math.abs(Math.round(b));
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // Reste de la division
    remainder(a, b) {
        return a % b;
    }

    // ============= CPX (Nombres complexes) =============

    showCpxMenu() {
        const menu = [
            'CPX',
            '1: conj(',
            '2: real(',
            '3: imag(',
            '4: angle(',
            '5: abs(',
            '6: ►Rect',
            '7: ►Polar'
        ];

        this.calculator.showMenu('MATH CPX', menu, (choice) => {
            const functions = {
                1: 'conj(',
                2: 'real(',
                3: 'imag(',
                4: 'angle(',
                5: 'abs('
            };
            if (functions[choice]) {
                this.calculator.inputFunction(functions[choice]);
            }
        });
    }

    // Conjugué d'un nombre complexe
    conj(real, imag) {
        return { real, imag: -imag };
    }

    // Partie réelle
    real(complex) {
        return complex.real;
    }

    // Partie imaginaire
    imag(complex) {
        return complex.imag;
    }

    // Angle (argument)
    angle(real, imag) {
        return Math.atan2(imag, real);
    }

    // Module d'un nombre complexe
    absComplex(real, imag) {
        return Math.sqrt(real * real + imag * imag);
    }

    // Convertir rectangulaire vers polaire
    rectToPolar(real, imag) {
        const r = this.absComplex(real, imag);
        const theta = this.angle(real, imag);
        return { r, theta };
    }

    // Convertir polaire vers rectangulaire
    polarToRect(r, theta) {
        const real = r * Math.cos(theta);
        const imag = r * Math.sin(theta);
        return { real, imag };
    }

    // ============= PRB (Probabilités) =============

    showPrbMenu() {
        const menu = [
            'PRB',
            '1: rand',
            '2: nPr',
            '3: nCr',
            '4: !',
            '5: randInt(',
            '6: randNorm(',
            '7: randBin(',
            '8: randSamp('
        ];

        this.calculator.showMenu('MATH PRB', menu, (choice) => {
            switch(choice) {
                case 1:
                    this.calculator.currentInput = Math.random().toString();
                    this.calculator.updateDisplay();
                    break;
                case 2:
                    this.calculator.inputFunction('nPr(');
                    break;
                case 3:
                    this.calculator.inputFunction('nCr(');
                    break;
                case 4:
                    this.calculator.inputOperator('!');
                    break;
                case 5:
                    this.calculator.inputFunction('randInt(');
                    break;
            }
        });
    }

    // Nombre aléatoire entre 0 et 1
    rand() {
        return Math.random();
    }

    // Permutations: nPr = n!/(n-r)!
    nPr(n, r) {
        if (r > n || r < 0 || n < 0) return 0;
        return this.factorial(n) / this.factorial(n - r);
    }

    // Combinaisons: nCr = n!/(r!(n-r)!)
    nCr(n, r) {
        if (r > n || r < 0 || n < 0) return 0;
        if (r === 0 || r === n) return 1;

        // Optimisation: C(n,r) = C(n,n-r)
        if (r > n - r) {
            r = n - r;
        }

        let result = 1;
        for (let i = 0; i < r; i++) {
            result *= (n - i);
            result /= (i + 1);
        }
        return Math.round(result);
    }

    // Factorielle
    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        if (n > 170) return Infinity; // Limite JavaScript

        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    // Entier aléatoire entre min et max (inclus)
    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Nombre aléatoire suivant une distribution normale
    randNorm(mean = 0, stdDev = 1) {
        // Box-Muller transform
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return z0 * stdDev + mean;
    }

    // ============= Calcul différentiel et intégral =============

    // Dérivée numérique: nDeriv(f, x, h)
    nDeriv(func, x, h = 0.001) {
        try {
            const f1 = this.calculator.graphingEngine.evaluateFunction(func, x + h);
            const f2 = this.calculator.graphingEngine.evaluateFunction(func, x - h);
            return (f1 - f2) / (2 * h);
        } catch (e) {
            return NaN;
        }
    }

    // Intégrale numérique: fnInt(f, x, a, b) - Méthode de Simpson
    fnInt(func, a, b, n = 1000) {
        if (a === b) return 0;
        if (a > b) {
            return -this.fnInt(func, b, a, n);
        }

        const h = (b - a) / n;
        let sum = 0;

        try {
            // Méthode de Simpson
            const f_a = this.calculator.graphingEngine.evaluateFunction(func, a);
            const f_b = this.calculator.graphingEngine.evaluateFunction(func, b);

            sum = f_a + f_b;

            for (let i = 1; i < n; i++) {
                const x = a + i * h;
                const f_x = this.calculator.graphingEngine.evaluateFunction(func, x);
                sum += (i % 2 === 0 ? 2 : 4) * f_x;
            }

            return (h / 3) * sum;
        } catch (e) {
            return NaN;
        }
    }

    // Méthode de Newton-Raphson pour trouver les zéros
    solve(func, initialGuess = 0, tolerance = 1e-6, maxIterations = 100) {
        let x = initialGuess;

        for (let i = 0; i < maxIterations; i++) {
            try {
                const fx = this.calculator.graphingEngine.evaluateFunction(func, x);
                if (Math.abs(fx) < tolerance) {
                    return x;
                }

                const derivative = this.nDeriv(func, x);
                if (Math.abs(derivative) < 1e-10) {
                    return NaN; // Dérivée trop petite
                }

                x = x - fx / derivative;
            } catch (e) {
                return NaN;
            }
        }

        return x;
    }

    // Trouver le minimum d'une fonction
    fMin(func, a, b, tolerance = 1e-6) {
        // Méthode de la section dorée
        const phi = (1 + Math.sqrt(5)) / 2;
        const resphi = 2 - phi;

        let x1 = a + resphi * (b - a);
        let x2 = b - resphi * (b - a);
        let f1 = this.calculator.graphingEngine.evaluateFunction(func, x1);
        let f2 = this.calculator.graphingEngine.evaluateFunction(func, x2);

        while (Math.abs(b - a) > tolerance) {
            if (f1 < f2) {
                b = x2;
                x2 = x1;
                f2 = f1;
                x1 = a + resphi * (b - a);
                f1 = this.calculator.graphingEngine.evaluateFunction(func, x1);
            } else {
                a = x1;
                x1 = x2;
                f1 = f2;
                x2 = b - resphi * (b - a);
                f2 = this.calculator.graphingEngine.evaluateFunction(func, x2);
            }
        }

        return (a + b) / 2;
    }

    // Trouver le maximum d'une fonction
    fMax(func, a, b, tolerance = 1e-6) {
        // Inverser la fonction et trouver le minimum
        const negFunc = `-(${func})`;
        return this.fMin(negFunc, a, b, tolerance);
    }

    // ============= Distribution de probabilité =============

    showDistrMenu() {
        const menu = [
            'DISTR',
            'DISTR DRAW',
            '1: normalpdf(',
            '2: normalcdf(',
            '3: invNorm(',
            '4: tpdf(',
            '5: tcdf(',
            '6: χ²pdf(',
            '7: χ²cdf(',
            '8: Fpdf(',
            '9: Fcdf(',
            '0: binompdf(',
            'A: binomcdf(',
            'B: poissonpdf(',
            'C: poissoncdf(',
            'D: geometpdf(',
            'E: geometcdf('
        ];

        this.calculator.showMenu('DISTR', menu);
    }

    // Densité de probabilité normale (PDF)
    normalPdf(x, mean = 0, stdDev = 1) {
        const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
        const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
        return coefficient * Math.exp(exponent);
    }

    // Distribution cumulative normale (CDF) - Approximation
    normalCdf(lower, upper, mean = 0, stdDev = 1) {
        const erf = (x) => {
            // Approximation de la fonction d'erreur
            const a1 = 0.254829592;
            const a2 = -0.284496736;
            const a3 = 1.421413741;
            const a4 = -1.453152027;
            const a5 = 1.061405429;
            const p = 0.3275911;

            const sign = x < 0 ? -1 : 1;
            x = Math.abs(x);

            const t = 1.0 / (1.0 + p * x);
            const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

            return sign * y;
        };

        const cdf = (x) => {
            return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
        };

        return cdf(upper) - cdf(lower);
    }

    // Distribution binomiale (PDF)
    binomPdf(n, p, k) {
        return this.nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }

    // Distribution binomiale cumulative (CDF)
    binomCdf(n, p, k) {
        let sum = 0;
        for (let i = 0; i <= k; i++) {
            sum += this.binomPdf(n, p, i);
        }
        return sum;
    }

    // Distribution de Poisson (PDF)
    poissonPdf(lambda, k) {
        return (Math.pow(lambda, k) * Math.exp(-lambda)) / this.factorial(k);
    }

    // Distribution de Poisson cumulative (CDF)
    poissonCdf(lambda, k) {
        let sum = 0;
        for (let i = 0; i <= k; i++) {
            sum += this.poissonPdf(lambda, i);
        }
        return sum;
    }

    // Distribution géométrique (PDF)
    geometPdf(p, k) {
        return Math.pow(1 - p, k - 1) * p;
    }

    // Distribution géométrique cumulative (CDF)
    geometCdf(p, k) {
        return 1 - Math.pow(1 - p, k);
    }
}
