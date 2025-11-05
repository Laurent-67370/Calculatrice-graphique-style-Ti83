// Calculatrice TI-83 Plus - Moteur de calcul
class TI83Calculator {
    constructor() {
        this.display = document.getElementById('input');
        this.historyDisplay = document.getElementById('history');
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');

        // État de la calculatrice
        this.currentInput = '0';
        this.history = [];
        this.memory = {};
        this.variables = {
            X: 0,
            Y: 0,
            T: 0,
            θ: 0,
            A: 0, B: 0, C: 0, D: 0, E: 0, F: 0,
            G: 0, H: 0, I: 0, J: 0, K: 0, L: 0,
            M: 0, N: 0, O: 0, P: 0, Q: 0, R: 0,
            S: 0, U: 0, V: 0, W: 0, Z: 0
        };
        this.lastAnswer = 0;

        // Modes
        this.angleMode = 'RAD'; // ou 'DEG'
        this.isSecondMode = false;
        this.isAlphaMode = false;
        this.isGraphMode = false;
        this.currentMode = 'NORMAL'; // NORMAL, STAT, MATH, etc.

        // Fonctions graphiques
        this.graphFunctions = ['', '', '', '', '', '']; // Y1-Y6
        this.currentFunction = 0;
        this.windowSettings = {
            xMin: -10,
            xMax: 10,
            yMin: -10,
            yMax: 10,
            xScale: 1,
            yScale: 1
        };

        // Listes pour statistiques
        this.lists = {
            L1: [],
            L2: [],
            L3: [],
            L4: [],
            L5: [],
            L6: []
        };

        // Curseur
        this.cursorPosition = 0;

        this.init();
    }

    init() {
        this.updateDisplay();
        this.updateIndicators();
        this.attachEventListeners();
    }

    attachEventListeners() {
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.addEventListener('click', (e) => {
                this.handleKeyPress(e.currentTarget.dataset.action);
                this.animateKey(e.currentTarget);
            });
        });

        // Support clavier physique
        document.addEventListener('keydown', (e) => this.handlePhysicalKeyboard(e));
    }

    animateKey(keyElement) {
        keyElement.classList.add('pressed');
        setTimeout(() => keyElement.classList.remove('pressed'), 200);
    }

    handlePhysicalKeyboard(e) {
        const keyMap = {
            '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
            '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
            '+': 'add', '-': 'subtract', '*': 'multiply', '/': 'divide',
            'Enter': 'enter', 'Backspace': 'del', 'Escape': 'clear',
            '.': 'decimal', '(': 'lparen', ')': 'rparen',
            '^': 'power', ',': 'comma'
        };

        if (keyMap[e.key]) {
            e.preventDefault();
            this.handleKeyPress(keyMap[e.key]);
        }
    }

    handleKeyPress(action) {
        // Gestion des modes spéciaux
        if (action === '2nd') {
            this.isSecondMode = !this.isSecondMode;
            this.updateIndicators();
            return;
        }

        if (action === 'alpha') {
            this.isAlphaMode = !this.isAlphaMode;
            this.updateIndicators();
            return;
        }

        // Gestion des actions avec 2nd
        if (this.isSecondMode) {
            this.handleSecondaryFunction(action);
            this.isSecondMode = false;
            this.updateIndicators();
            return;
        }

        // Gestion des actions avec Alpha
        if (this.isAlphaMode) {
            this.handleAlphaFunction(action);
            this.isAlphaMode = false;
            this.updateIndicators();
            return;
        }

        // Actions normales
        switch(action) {
            // Chiffres
            case '0': case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '8': case '9':
                this.inputDigit(action);
                break;

            // Opérations
            case 'add':
                this.inputOperator('+');
                break;
            case 'subtract':
                this.inputOperator('-');
                break;
            case 'multiply':
                this.inputOperator('×');
                break;
            case 'divide':
                this.inputOperator('÷');
                break;
            case 'power':
                this.inputOperator('^');
                break;

            // Fonctions
            case 'sin':
                this.inputFunction('sin(');
                break;
            case 'cos':
                this.inputFunction('cos(');
                break;
            case 'tan':
                this.inputFunction('tan(');
                break;
            case 'log':
                this.inputFunction('log(');
                break;
            case 'ln':
                this.inputFunction('ln(');
                break;
            case 'x-squared':
                this.inputOperator('^2');
                break;
            case 'x-inverse':
                this.inputOperator('^(-1)');
                break;

            // Parenthèses et ponctuation
            case 'lparen':
                this.inputCharacter('(');
                break;
            case 'rparen':
                this.inputCharacter(')');
                break;
            case 'comma':
                this.inputCharacter(',');
                break;
            case 'decimal':
                this.inputDecimal();
                break;

            // Variables
            case 'x-var':
                this.inputCharacter('X');
                break;

            // Actions spéciales
            case 'enter':
                this.calculate();
                break;
            case 'clear':
                this.clear();
                break;
            case 'del':
                this.deleteLastChar();
                break;
            case 'negative':
                this.toggleNegative();
                break;

            // Modes
            case 'mode':
                this.openModeMenu();
                break;
            case 'graph':
                this.toggleGraphMode();
                break;
            case 'y-vars':
                this.openYEditor();
                break;
            case 'stat':
                this.openStatMenu();
                break;
            case 'math':
                this.openMathMenu();
                break;
            case 'sto':
                this.storeVariable();
                break;

            // Navigation
            case 'left':
                this.moveCursor(-1);
                break;
            case 'right':
                this.moveCursor(1);
                break;

            // Power
            case 'on':
                this.powerOn();
                break;
        }

        this.updateDisplay();
    }

    handleSecondaryFunction(action) {
        switch(action) {
            case 'sin':
                this.inputFunction('asin(');
                break;
            case 'cos':
                this.inputFunction('acos(');
                break;
            case 'tan':
                this.inputFunction('atan(');
                break;
            case 'log':
                this.inputFunction('10^(');
                break;
            case 'ln':
                this.inputFunction('e^(');
                break;
            case 'x-squared':
                this.inputFunction('√(');
                break;
            case 'power':
                this.inputCharacter('π');
                break;
            case 'comma':
                this.inputCharacter('e');
                break;
            case 'negative':
                this.inputAns();
                break;
            case 'mode':
                this.quit();
                break;
            case 'on':
                this.powerOff();
                break;
        }
    }

    handleAlphaFunction(action) {
        const alphaMap = {
            'x-var': 'A', 'stat': 'B', 'math': 'C', 'apps': 'D',
            'prgm': 'E', 'x-inverse': 'F', 'sin': 'G', 'cos': 'H',
            'tan': 'I', 'power': 'J', 'x-squared': 'K', 'comma': 'L',
            'lparen': 'M', 'rparen': 'N', 'divide': 'O', 'log': 'P',
            '7': 'Q', '8': 'R', '9': 'S', 'multiply': 'T',
            'ln': 'U', '4': 'V', '5': 'W', '6': 'X',
            'subtract': 'Y', 'sto': 'Z'
        };

        if (alphaMap[action]) {
            this.inputCharacter(alphaMap[action]);
        }
    }

    inputDigit(digit) {
        if (this.currentInput === '0' || this.currentInput === 'Error') {
            this.currentInput = digit;
        } else {
            this.currentInput += digit;
        }
    }

    inputOperator(operator) {
        if (this.currentInput === '0' || this.currentInput === '') {
            return;
        }
        this.currentInput += operator;
    }

    inputFunction(func) {
        if (this.currentInput === '0') {
            this.currentInput = func;
        } else {
            this.currentInput += func;
        }
    }

    inputCharacter(char) {
        if (this.currentInput === '0') {
            this.currentInput = char;
        } else {
            this.currentInput += char;
        }
    }

    inputDecimal() {
        // Vérifier si le dernier nombre a déjà un point décimal
        const lastNumberMatch = this.currentInput.match(/[\d.]+$/);
        if (lastNumberMatch && !lastNumberMatch[0].includes('.')) {
            this.currentInput += '.';
        } else if (!lastNumberMatch) {
            this.currentInput += '0.';
        }
    }

    inputAns() {
        this.currentInput += 'Ans';
    }

    deleteLastChar() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
    }

    clear() {
        this.currentInput = '0';
        this.cursorPosition = 0;
    }

    toggleNegative() {
        if (this.currentInput === '0') {
            this.currentInput = '-';
        } else if (this.currentInput.startsWith('-')) {
            this.currentInput = this.currentInput.substring(1);
        } else {
            this.currentInput = '-' + this.currentInput;
        }
    }

    calculate() {
        try {
            // Préparer l'expression
            let expression = this.currentInput;

            // Remplacer les symboles spéciaux
            expression = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, Math.PI.toString())
                .replace(/e(?![0-9])/g, Math.E.toString())
                .replace(/Ans/g, this.lastAnswer.toString());

            // Remplacer les variables
            for (let varName in this.variables) {
                const regex = new RegExp(varName, 'g');
                expression = expression.replace(regex, this.variables[varName].toString());
            }

            // Évaluer l'expression
            const result = this.evaluateExpression(expression);

            // Enregistrer dans l'historique
            this.history.push({
                expression: this.currentInput,
                result: result
            });

            if (this.history.length > 5) {
                this.history.shift();
            }

            // Mettre à jour l'affichage
            this.lastAnswer = result;
            this.currentInput = this.formatNumber(result);
            this.updateHistory();

        } catch (error) {
            this.currentInput = 'Error';
            console.error('Calculation error:', error);
        }
    }

    evaluateExpression(expr) {
        // Remplacer les fonctions mathématiques
        expr = expr
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/asin\(/g, 'Math.asin(')
            .replace(/acos\(/g, 'Math.acos(')
            .replace(/atan\(/g, 'Math.atan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/√\(/g, 'Math.sqrt(')
            .replace(/10\^/g, 'Math.pow(10,')
            .replace(/e\^/g, 'Math.exp(');

        // Gérer les puissances
        expr = this.handlePowers(expr);

        // Convertir les angles si nécessaire
        if (this.angleMode === 'DEG') {
            expr = this.convertToRadians(expr);
        }

        // Évaluer l'expression
        // Note: eval() est utilisé ici pour la simplicité, mais dans un environnement
        // de production, il faudrait utiliser un parser plus sécurisé
        const result = Function('"use strict"; return (' + expr + ')')();

        return result;
    }

    handlePowers(expr) {
        // Remplacer x^y par Math.pow(x, y)
        let result = expr;
        const powerRegex = /([0-9.]+|\([^)]+\))\^([0-9.]+|\([^)]+\))/g;

        let match;
        while ((match = powerRegex.exec(result)) !== null) {
            const base = match[1];
            const exponent = match[2];
            result = result.replace(match[0], `Math.pow(${base},${exponent})`);
        }

        return result;
    }

    convertToRadians(expr) {
        // Convertir les arguments des fonctions trigo en radians
        const trigFunctions = ['Math.sin', 'Math.cos', 'Math.tan'];

        trigFunctions.forEach(func => {
            const regex = new RegExp(func + '\\(([^)]+)\\)', 'g');
            expr = expr.replace(regex, (match, arg) => {
                return `${func}((${arg}) * Math.PI / 180)`;
            });
        });

        return expr;
    }

    formatNumber(num) {
        if (isNaN(num) || !isFinite(num)) {
            return 'Error';
        }

        // Formater le nombre avec jusqu'à 10 décimales
        let formatted = parseFloat(num.toPrecision(10));

        // Utiliser la notation scientifique si nécessaire
        if (Math.abs(formatted) > 9999999999 || (Math.abs(formatted) < 0.0001 && formatted !== 0)) {
            return formatted.toExponential(6);
        }

        return formatted.toString();
    }

    storeVariable() {
        // STO► : stocker la valeur actuelle dans une variable
        if (this.currentInput === '0' || this.currentInput === 'Error') {
            return;
        }

        this.currentInput += '→';
    }

    openModeMenu() {
        const modes = ['Normal', 'Sci', 'Eng', 'Float'];
        // Implémenter un menu pour changer de mode
        console.log('Mode menu opened');
    }

    toggleGraphMode() {
        this.isGraphMode = !this.isGraphMode;
        const calculator = document.querySelector('.calculator');

        if (this.isGraphMode) {
            calculator.classList.add('graph-mode');
            this.canvas.classList.add('active');
            if (window.graphingEngine) {
                window.graphingEngine.drawGraph();
            }
        } else {
            calculator.classList.remove('graph-mode');
            this.canvas.classList.remove('active');
        }

        this.updateIndicators();
    }

    openYEditor() {
        // Ouvrir l'éditeur de fonctions Y=
        this.isGraphMode = false;
        this.currentMode = 'Y-EDITOR';
        this.currentInput = `Y${this.currentFunction + 1}=${this.graphFunctions[this.currentFunction]}`;
    }

    openStatMenu() {
        this.currentMode = 'STAT';
        console.log('Statistics menu opened');
    }

    openMathMenu() {
        this.currentMode = 'MATH';
        console.log('Math menu opened');
    }

    moveCursor(direction) {
        this.cursorPosition += direction;
        this.cursorPosition = Math.max(0, Math.min(this.currentInput.length, this.cursorPosition));
    }

    powerOn() {
        this.clear();
        this.updateDisplay();
    }

    powerOff() {
        this.currentInput = '';
        this.updateDisplay();
    }

    quit() {
        this.isGraphMode = false;
        this.currentMode = 'NORMAL';
        const calculator = document.querySelector('.calculator');
        calculator.classList.remove('graph-mode');
        this.canvas.classList.remove('active');
        this.clear();
    }

    updateDisplay() {
        this.display.textContent = this.currentInput || '0';
    }

    updateHistory() {
        let historyHTML = '';
        this.history.slice(-3).forEach(item => {
            historyHTML += `${item.expression}=${item.result}\n`;
        });
        this.historyDisplay.textContent = historyHTML;
    }

    updateIndicators() {
        const radDegIndicator = document.getElementById('rad-deg');
        const statIndicator = document.getElementById('stat');
        const graphIndicator = document.getElementById('graph');

        radDegIndicator.textContent = this.angleMode;
        radDegIndicator.classList.toggle('active', true);

        statIndicator.classList.toggle('active', this.currentMode === 'STAT');
        graphIndicator.classList.toggle('active', this.isGraphMode);
    }
}

// Initialiser la calculatrice au chargement de la page
let calculator;
document.addEventListener('DOMContentLoaded', () => {
    calculator = new TI83Calculator();
});
