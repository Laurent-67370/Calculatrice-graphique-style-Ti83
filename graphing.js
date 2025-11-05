// Moteur graphique pour TI-83 Plus
class GraphingEngine {
    constructor(calculator) {
        this.calculator = calculator;
        this.canvas = calculator.canvas;
        this.ctx = calculator.ctx;

        // Paramètres de la fenêtre
        this.window = {
            xMin: -10,
            xMax: 10,
            yMin: -10,
            yMax: 10,
            xScale: 1,
            yScale: 1
        };

        // Fonctions à tracer (Y1, Y2, etc.)
        this.functions = [];
        this.activeFunctions = [true, false, false, false, false, false];

        // Couleurs pour les fonctions
        this.colors = ['#000000', '#0000FF', '#FF0000', '#00FF00', '#FF00FF', '#00FFFF'];

        // Mode trace
        this.traceMode = false;
        this.traceX = 0;

        // Zoom presets
        this.zoomPresets = {
            standard: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
            trig: { xMin: -2*Math.PI, xMax: 2*Math.PI, yMin: -4, yMax: 4 },
            decimal: { xMin: -4.7, xMax: 4.7, yMin: -3.1, yMax: 3.1 },
            square: { xMin: -7.5, xMax: 7.5, yMin: -5, yMax: 5 }
        };

        this.init();
    }

    init() {
        // Initialiser avec quelques fonctions par défaut
        this.functions = [
            'X^2',           // Y1
            'sin(X)',        // Y2
            '',              // Y3
            '',              // Y4
            '',              // Y5
            ''               // Y6
        ];
    }

    setFunction(index, expression) {
        if (index >= 0 && index < 6) {
            this.functions[index] = expression;
        }
    }

    toggleFunction(index) {
        if (index >= 0 && index < 6) {
            this.activeFunctions[index] = !this.activeFunctions[index];
        }
    }

    setWindow(xMin, xMax, yMin, yMax) {
        this.window.xMin = xMin;
        this.window.xMax = xMax;
        this.window.yMin = yMin;
        this.window.yMax = yMax;
    }

    zoom(preset) {
        if (this.zoomPresets[preset]) {
            const settings = this.zoomPresets[preset];
            this.setWindow(settings.xMin, settings.xMax, settings.yMin, settings.yMax);
            this.drawGraph();
        }
    }

    zoomIn() {
        const xRange = this.window.xMax - this.window.xMin;
        const yRange = this.window.yMax - this.window.yMin;
        const xCenter = (this.window.xMax + this.window.xMin) / 2;
        const yCenter = (this.window.yMax + this.window.yMin) / 2;

        this.window.xMin = xCenter - xRange / 4;
        this.window.xMax = xCenter + xRange / 4;
        this.window.yMin = yCenter - yRange / 4;
        this.window.yMax = yCenter + yRange / 4;

        this.drawGraph();
    }

    zoomOut() {
        const xRange = this.window.xMax - this.window.xMin;
        const yRange = this.window.yMax - this.window.yMin;
        const xCenter = (this.window.xMax + this.window.xMin) / 2;
        const yCenter = (this.window.yMax + this.window.yMin) / 2;

        this.window.xMin = xCenter - xRange;
        this.window.xMax = xCenter + xRange;
        this.window.yMin = yCenter - yRange;
        this.window.yMax = yCenter + yRange;

        this.drawGraph();
    }

    drawGraph() {
        // Effacer le canvas
        this.ctx.fillStyle = '#9ca99c';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner les axes et la grille
        this.drawAxes();
        this.drawGrid();

        // Dessiner chaque fonction active
        this.functions.forEach((func, index) => {
            if (this.activeFunctions[index] && func.trim() !== '') {
                this.drawFunction(func, this.colors[index]);
            }
        });

        // Dessiner le curseur de trace si actif
        if (this.traceMode) {
            this.drawTraceCursor();
        }
    }

    drawAxes() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Calculer les positions des axes en pixels
        const xAxisY = this.yToPixel(0);
        const yAxisX = this.xToPixel(0);

        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1.5;

        // Axe X
        if (xAxisY >= 0 && xAxisY <= height) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, xAxisY);
            this.ctx.lineTo(width, xAxisY);
            this.ctx.stroke();

            // Flèche
            this.ctx.beginPath();
            this.ctx.moveTo(width - 10, xAxisY - 5);
            this.ctx.lineTo(width, xAxisY);
            this.ctx.lineTo(width - 10, xAxisY + 5);
            this.ctx.stroke();
        }

        // Axe Y
        if (yAxisX >= 0 && yAxisX <= width) {
            this.ctx.beginPath();
            this.ctx.moveTo(yAxisX, 0);
            this.ctx.lineTo(yAxisX, height);
            this.ctx.stroke();

            // Flèche
            this.ctx.beginPath();
            this.ctx.moveTo(yAxisX - 5, 10);
            this.ctx.lineTo(yAxisX, 0);
            this.ctx.lineTo(yAxisX + 5, 10);
            this.ctx.stroke();
        }
    }

    drawGrid() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        this.ctx.strokeStyle = '#d0d0d0';
        this.ctx.lineWidth = 0.5;

        // Grille verticale
        const xStep = this.window.xScale || 1;
        for (let x = Math.ceil(this.window.xMin / xStep) * xStep; x <= this.window.xMax; x += xStep) {
            const pixelX = this.xToPixel(x);
            if (pixelX >= 0 && pixelX <= width && Math.abs(x) > 0.001) {
                this.ctx.beginPath();
                this.ctx.moveTo(pixelX, 0);
                this.ctx.lineTo(pixelX, height);
                this.ctx.stroke();
            }
        }

        // Grille horizontale
        const yStep = this.window.yScale || 1;
        for (let y = Math.ceil(this.window.yMin / yStep) * yStep; y <= this.window.yMax; y += yStep) {
            const pixelY = this.yToPixel(y);
            if (pixelY >= 0 && pixelY <= height && Math.abs(y) > 0.001) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, pixelY);
                this.ctx.lineTo(width, pixelY);
                this.ctx.stroke();
            }
        }

        // Marques sur les axes
        this.drawAxisMarks();
    }

    drawAxisMarks() {
        const xAxisY = this.yToPixel(0);
        const yAxisX = this.xToPixel(0);

        this.ctx.fillStyle = '#000000';
        this.ctx.font = '8px Courier New';

        // Marques sur l'axe X
        const xStep = this.window.xScale || 1;
        for (let x = Math.ceil(this.window.xMin / xStep) * xStep; x <= this.window.xMax; x += xStep) {
            if (Math.abs(x) > 0.001) {
                const pixelX = this.xToPixel(x);
                if (xAxisY >= 0 && xAxisY <= this.canvas.height) {
                    // Petite marque
                    this.ctx.beginPath();
                    this.ctx.moveTo(pixelX, xAxisY - 3);
                    this.ctx.lineTo(pixelX, xAxisY + 3);
                    this.ctx.stroke();

                    // Nombre
                    const label = x.toFixed(x % 1 === 0 ? 0 : 1);
                    this.ctx.fillText(label, pixelX - 10, xAxisY + 15);
                }
            }
        }

        // Marques sur l'axe Y
        const yStep = this.window.yScale || 1;
        for (let y = Math.ceil(this.window.yMin / yStep) * yStep; y <= this.window.yMax; y += yStep) {
            if (Math.abs(y) > 0.001) {
                const pixelY = this.yToPixel(y);
                if (yAxisX >= 0 && yAxisX <= this.canvas.width) {
                    // Petite marque
                    this.ctx.beginPath();
                    this.ctx.moveTo(yAxisX - 3, pixelY);
                    this.ctx.lineTo(yAxisX + 3, pixelY);
                    this.ctx.stroke();

                    // Nombre
                    const label = y.toFixed(y % 1 === 0 ? 0 : 1);
                    this.ctx.fillText(label, yAxisX + 5, pixelY + 3);
                }
            }
        }
    }

    drawFunction(expression, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        let firstPoint = true;
        const pixelStep = 1; // Tracer point par point
        const width = this.canvas.width;

        for (let pixelX = 0; pixelX <= width; pixelX += pixelStep) {
            const x = this.pixelToX(pixelX);

            try {
                const y = this.evaluateFunction(expression, x);

                if (isFinite(y) && !isNaN(y)) {
                    const pixelY = this.yToPixel(y);

                    // Vérifier que le point est dans les limites
                    if (pixelY >= -100 && pixelY <= this.canvas.height + 100) {
                        if (firstPoint) {
                            this.ctx.moveTo(pixelX, pixelY);
                            firstPoint = false;
                        } else {
                            this.ctx.lineTo(pixelX, pixelY);
                        }
                    } else {
                        firstPoint = true;
                    }
                } else {
                    firstPoint = true;
                }
            } catch (e) {
                firstPoint = true;
            }
        }

        this.ctx.stroke();
    }

    evaluateFunction(expression, xValue) {
        // Remplacer X par la valeur
        let expr = expression.replace(/X/g, `(${xValue})`);

        // Remplacer les symboles spéciaux
        expr = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π/g, Math.PI.toString())
            .replace(/e(?![0-9])/g, Math.E.toString());

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
            .replace(/abs\(/g, 'Math.abs(');

        // Gérer les puissances
        expr = this.handlePowers(expr);

        // Convertir les angles si nécessaire
        if (this.calculator.angleMode === 'DEG') {
            const trigFunctions = ['Math.sin', 'Math.cos', 'Math.tan'];
            trigFunctions.forEach(func => {
                const regex = new RegExp(func + '\\(([^)]+)\\)', 'g');
                expr = expr.replace(regex, (match, arg) => {
                    return `${func}((${arg}) * Math.PI / 180)`;
                });
            });
        }

        // Évaluer l'expression
        return Function('"use strict"; return (' + expr + ')')();
    }

    handlePowers(expr) {
        // Remplacer x^y par Math.pow(x, y)
        let result = expr;
        const powerRegex = /([0-9.]+|\([^)]+\))\^([0-9.]+|\([^)]+\)|[0-9.]+)/g;

        let iterations = 0;
        while (powerRegex.test(result) && iterations < 10) {
            result = result.replace(powerRegex, (match, base, exponent) => {
                return `Math.pow(${base},${exponent})`;
            });
            iterations++;
        }

        return result;
    }

    drawTraceCursor() {
        const y = this.evaluateFunction(this.functions[0], this.traceX);
        if (isFinite(y) && !isNaN(y)) {
            const pixelX = this.xToPixel(this.traceX);
            const pixelY = this.yToPixel(y);

            // Dessiner le curseur
            this.ctx.fillStyle = '#FF0000';
            this.ctx.beginPath();
            this.ctx.arc(pixelX, pixelY, 3, 0, 2 * Math.PI);
            this.ctx.fill();

            // Afficher les coordonnées
            this.ctx.fillStyle = '#000000';
            this.ctx.font = '10px Courier New';
            this.ctx.fillText(`X=${this.traceX.toFixed(3)}`, 5, 15);
            this.ctx.fillText(`Y=${y.toFixed(3)}`, 5, 30);
        }
    }

    // Conversions pixel ↔ coordonnées
    xToPixel(x) {
        const width = this.canvas.width;
        return ((x - this.window.xMin) / (this.window.xMax - this.window.xMin)) * width;
    }

    yToPixel(y) {
        const height = this.canvas.height;
        return height - ((y - this.window.yMin) / (this.window.yMax - this.window.yMin)) * height;
    }

    pixelToX(pixel) {
        const width = this.canvas.width;
        return this.window.xMin + (pixel / width) * (this.window.xMax - this.window.xMin);
    }

    pixelToY(pixel) {
        const height = this.canvas.height;
        return this.window.yMin + ((height - pixel) / height) * (this.window.yMax - this.window.yMin);
    }

    // Fonctions de trace
    enableTrace() {
        this.traceMode = true;
        this.traceX = 0;
        this.drawGraph();
    }

    disableTrace() {
        this.traceMode = false;
        this.drawGraph();
    }

    moveTrace(direction) {
        if (this.traceMode) {
            const step = (this.window.xMax - this.window.xMin) / 100;
            this.traceX += direction * step;
            this.traceX = Math.max(this.window.xMin, Math.min(this.window.xMax, this.traceX));
            this.drawGraph();
        }
    }

    // Table de valeurs
    generateTable(func, start, end, step) {
        const table = [];
        for (let x = start; x <= end; x += step) {
            try {
                const y = this.evaluateFunction(func, x);
                table.push({ x: x, y: y });
            } catch (e) {
                table.push({ x: x, y: 'Error' });
            }
        }
        return table;
    }

    // Trouver les zéros (intersections avec l'axe X)
    findZeros(func, xMin, xMax, precision = 0.001) {
        const zeros = [];
        const step = (xMax - xMin) / 1000;

        for (let x = xMin; x < xMax; x += step) {
            try {
                const y1 = this.evaluateFunction(func, x);
                const y2 = this.evaluateFunction(func, x + step);

                // Changement de signe = zéro
                if (y1 * y2 < 0) {
                    // Affiner avec la méthode de bissection
                    let a = x;
                    let b = x + step;
                    while (b - a > precision) {
                        const mid = (a + b) / 2;
                        const yMid = this.evaluateFunction(func, mid);
                        if (Math.abs(yMid) < precision) {
                            zeros.push(mid);
                            break;
                        }
                        if (y1 * yMid < 0) {
                            b = mid;
                        } else {
                            a = mid;
                        }
                    }
                }
            } catch (e) {
                // Ignorer les erreurs
            }
        }

        return zeros;
    }

    // Trouver les extrema (min/max locaux)
    findExtrema(func, xMin, xMax) {
        const extrema = { min: [], max: [] };
        const step = (xMax - xMin) / 1000;

        for (let x = xMin + step; x < xMax - step; x += step) {
            try {
                const y1 = this.evaluateFunction(func, x - step);
                const y2 = this.evaluateFunction(func, x);
                const y3 = this.evaluateFunction(func, x + step);

                // Maximum local
                if (y2 > y1 && y2 > y3) {
                    extrema.max.push({ x: x, y: y2 });
                }

                // Minimum local
                if (y2 < y1 && y2 < y3) {
                    extrema.min.push({ x: x, y: y2 });
                }
            } catch (e) {
                // Ignorer les erreurs
            }
        }

        return extrema;
    }
}

// Initialiser le moteur graphique
let graphingEngine;
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que la calculatrice soit initialisée
    setTimeout(() => {
        if (window.calculator) {
            graphingEngine = new GraphingEngine(window.calculator);
            window.graphingEngine = graphingEngine;

            // Ajouter des contrôles pour le mode graphique
            document.addEventListener('keydown', (e) => {
                if (calculator.isGraphMode) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        graphingEngine.moveTrace(-1);
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        graphingEngine.moveTrace(1);
                    } else if (e.key === '+') {
                        e.preventDefault();
                        graphingEngine.zoomIn();
                    } else if (e.key === '-') {
                        e.preventDefault();
                        graphingEngine.zoomOut();
                    }
                }
            });
        }
    }, 100);
});
