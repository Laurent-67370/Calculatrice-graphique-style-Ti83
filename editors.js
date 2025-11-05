// Module des éditeurs pour TI-83 Plus
class EditorsModule {
    constructor(calculator) {
        this.calculator = calculator;
        this.currentEditor = null;
        this.cursorY = 0;
        this.tableStart = -5;
        this.tableStep = 1;
    }

    // ============= Y= EDITOR =============

    openYEditor() {
        this.currentEditor = 'Y_EDITOR';
        this.cursorY = 0;
        this.displayYEditor();
    }

    displayYEditor() {
        let display = 'Plot1 Plot2 Plot3\n';
        display += '─────────────────\n';

        for (let i = 0; i < 6; i++) {
            const marker = i === this.cursorY ? '►' : ' ';
            const active = this.calculator.graphingEngine.activeFunctions[i] ? '\\' : ' ';
            const func = this.calculator.graphingEngine.functions[i] || '';
            display += `${marker}${active}Y${i + 1}=${func}\n`;
        }

        display += '\n▲▼: Navigate  ENTER: Edit';

        this.calculator.currentInput = display;
        this.calculator.updateDisplay();
    }

    editYFunction(index) {
        this.calculator.currentMode = 'Y_EDIT';
        this.calculator.currentFunction = index;
        this.calculator.currentInput = this.calculator.graphingEngine.functions[index] || '';
        this.calculator.updateDisplay();

        // Message d'aide
        setTimeout(() => {
            this.calculator.historyDisplay.textContent = `Editing Y${index + 1}\nENTER: Save  CLEAR: Cancel`;
        }, 100);
    }

    saveYFunction() {
        const index = this.calculator.currentFunction;
        this.calculator.graphingEngine.functions[index] = this.calculator.currentInput;
        this.calculator.graphingEngine.activeFunctions[index] = true;
        this.calculator.currentMode = 'NORMAL';
        this.calculator.currentInput = '0';
        this.calculator.updateDisplay();

        // Message de confirmation
        setTimeout(() => {
            this.calculator.historyDisplay.textContent = `Y${index + 1} sauvegardé\nAppuyez sur GRAPH pour tracer`;
        }, 100);
    }

    toggleYFunction(index) {
        this.calculator.graphingEngine.toggleFunction(index);
        this.displayYEditor();
    }

    // Navigation dans Y=
    navigateY(direction) {
        this.cursorY += direction;
        this.cursorY = Math.max(0, Math.min(5, this.cursorY));
        this.displayYEditor();
    }

    // ============= WINDOW EDITOR =============

    openWindowEditor() {
        this.currentEditor = 'WINDOW';
        this.cursorY = 0;
        this.displayWindowEditor();
    }

    displayWindowEditor() {
        const win = this.calculator.graphingEngine.window;
        const settings = [
            `Xmin=${win.xMin}`,
            `Xmax=${win.xMax}`,
            `Xscl=${win.xScale}`,
            `Ymin=${win.yMin}`,
            `Ymax=${win.yMax}`,
            `Yscl=${win.yScale}`,
            `Xres=1`
        ];

        let display = 'WINDOW\n';
        display += '─────────────────\n';

        settings.forEach((setting, i) => {
            const marker = i === this.cursorY ? '►' : ' ';
            display += `${marker}${setting}\n`;
        });

        display += '\n▲▼: Navigate  ENTER: Edit';

        this.calculator.currentInput = display;
        this.calculator.updateDisplay();
    }

    editWindowSetting(index) {
        const win = this.calculator.graphingEngine.window;
        const settings = ['xMin', 'xMax', 'xScale', 'yMin', 'yMax', 'yScale'];
        const settingName = settings[index];

        if (settingName) {
            this.calculator.currentMode = 'WINDOW_EDIT';
            this.calculator.editingSetting = settingName;
            this.calculator.currentInput = win[settingName].toString();
            this.calculator.updateDisplay();

            setTimeout(() => {
                this.calculator.historyDisplay.textContent = `Editing ${settingName}\nENTER: Save  CLEAR: Cancel`;
            }, 100);
        }
    }

    saveWindowSetting() {
        const settingName = this.calculator.editingSetting;
        const value = parseFloat(this.calculator.currentInput);

        if (!isNaN(value)) {
            this.calculator.graphingEngine.window[settingName] = value;
        }

        this.calculator.currentMode = 'NORMAL';
        this.displayWindowEditor();
    }

    navigateWindow(direction) {
        this.cursorY += direction;
        this.cursorY = Math.max(0, Math.min(6, this.cursorY));
        this.displayWindowEditor();
    }

    // ============= TABLE MODE =============

    openTableSetup() {
        this.currentEditor = 'TBLSET';
        this.cursorY = 0;
        this.displayTableSetup();
    }

    displayTableSetup() {
        let display = 'TABLE SETUP\n';
        display += '─────────────────\n';
        display += `►TblStart=${this.tableStart}\n`;
        display += ` ΔTbl=${this.tableStep}\n`;
        display += ' Indpnt: Auto\n';
        display += ' Depend: Auto\n';

        display += '\n▲▼: Navigate  ENTER: Edit';

        this.calculator.currentInput = display;
        this.calculator.updateDisplay();
    }

    showTable() {
        this.currentEditor = 'TABLE';
        this.displayTable();
    }

    displayTable() {
        let display = 'X      Y1      Y2\n';
        display += '──────────────────\n';

        const activeFunctions = this.calculator.graphingEngine.functions
            .map((f, i) => ({ func: f, index: i }))
            .filter((f, i) => this.calculator.graphingEngine.activeFunctions[i] && f.func);

        for (let i = 0; i < 7; i++) {
            const x = this.tableStart + i * this.tableStep;
            let row = `${x.toFixed(2).padEnd(7)}`;

            activeFunctions.forEach((f) => {
                try {
                    const y = this.calculator.graphingEngine.evaluateFunction(f.func, x);
                    row += `${y.toFixed(3).padEnd(8)}`;
                } catch (e) {
                    row += 'ERROR   ';
                }
            });

            display += row + '\n';
        }

        display += '\n▲▼: Scroll  2nd+WINDOW: Setup';

        this.calculator.currentInput = display;
        this.calculator.updateDisplay();
    }

    scrollTable(direction) {
        this.tableStart += direction * this.tableStep;
        this.displayTable();
    }

    // ============= FORMAT MENU =============

    openFormatMenu() {
        this.currentEditor = 'FORMAT';
        this.displayFormatMenu();
    }

    displayFormatMenu() {
        let display = 'FORMAT\n';
        display += '─────────────────\n';
        display += '►RectGC  PolarGC\n';
        display += ' CoordOn CoordOff\n';
        display += ' GridOff GridOn\n';
        display += ' AxesOn  AxesOff\n';
        display += ' LabelOff LabelOn\n';
        display += ' ExprOn  ExprOff\n';

        this.calculator.currentInput = display;
        this.calculator.updateDisplay();
    }

    // ============= ZOOM MENU =============

    openZoomMenu() {
        this.currentEditor = 'ZOOM';
        this.displayZoomMenu();
    }

    displayZoomMenu() {
        const menu = [
            'ZOOM MEMORY',
            '1: ZBox',
            '2: Zoom In',
            '3: Zoom Out',
            '4: ZDecimal',
            '5: ZSquare',
            '6: ZStandard',
            '7: ZTrig',
            '8: ZInteger',
            '9: ZoomStat',
            '0: ZoomFit'
        ];

        let display = 'ZOOM\n';
        display += '─────────────────\n';
        menu.forEach(item => display += item + '\n');

        this.calculator.currentInput = display;
        this.calculator.updateDisplay();
    }

    executeZoom(option) {
        const graphEngine = this.calculator.graphingEngine;

        switch(option) {
            case 2: // Zoom In
                graphEngine.zoomIn();
                break;
            case 3: // Zoom Out
                graphEngine.zoomOut();
                break;
            case 4: // ZDecimal
                graphEngine.zoom('decimal');
                break;
            case 5: // ZSquare
                graphEngine.zoom('square');
                break;
            case 6: // ZStandard
                graphEngine.zoom('standard');
                break;
            case 7: // ZTrig
                graphEngine.zoom('trig');
                break;
            case 8: // ZInteger
                graphEngine.setWindow(-47, 47, -31, 31);
                graphEngine.drawGraph();
                break;
            case 9: // ZoomStat
                this.zoomStat();
                break;
            case 0: // ZoomFit
                this.zoomFit();
                break;
        }

        this.calculator.currentMode = 'NORMAL';
    }

    // Zoom adapté aux données statistiques
    zoomStat() {
        const L1 = this.calculator.lists.L1;
        const L2 = this.calculator.lists.L2;

        if (L1.length === 0) return;

        const xMin = Math.min(...L1);
        const xMax = Math.max(...L1);
        const xRange = xMax - xMin;

        let yMin, yMax, yRange;

        if (L2.length > 0) {
            yMin = Math.min(...L2);
            yMax = Math.max(...L2);
            yRange = yMax - yMin;
        } else {
            yMin = -10;
            yMax = 10;
            yRange = 20;
        }

        // Ajouter une marge de 10%
        this.calculator.graphingEngine.setWindow(
            xMin - xRange * 0.1,
            xMax + xRange * 0.1,
            yMin - yRange * 0.1,
            yMax + yRange * 0.1
        );

        this.calculator.graphingEngine.drawGraph();
    }

    // Zoom adapté à la fonction affichée
    zoomFit() {
        const func = this.calculator.graphingEngine.functions[0];
        if (!func) return;

        const win = this.calculator.graphingEngine.window;
        const xMin = win.xMin;
        const xMax = win.xMax;
        const step = (xMax - xMin) / 100;

        let yMin = Infinity;
        let yMax = -Infinity;

        for (let x = xMin; x <= xMax; x += step) {
            try {
                const y = this.calculator.graphingEngine.evaluateFunction(func, x);
                if (isFinite(y)) {
                    yMin = Math.min(yMin, y);
                    yMax = Math.max(yMax, y);
                }
            } catch (e) {
                // Ignorer les erreurs
            }
        }

        if (isFinite(yMin) && isFinite(yMax)) {
            const yRange = yMax - yMin;
            this.calculator.graphingEngine.window.yMin = yMin - yRange * 0.1;
            this.calculator.graphingEngine.window.yMax = yMax + yRange * 0.1;
            this.calculator.graphingEngine.drawGraph();
        }
    }

    // ============= CALC MENU (Analyse de graphique) =============

    openCalcMenu() {
        this.currentEditor = 'CALC';
        this.displayCalcMenu();
    }

    displayCalcMenu() {
        const menu = [
            'CALCULATE',
            '1: value',
            '2: zero',
            '3: minimum',
            '4: maximum',
            '5: intersect',
            '6: dy/dx',
            '7: ∫f(x)dx'
        ];

        let display = 'CALC\n';
        display += '─────────────────\n';
        menu.forEach(item => display += item + '\n');

        this.calculator.currentInput = display;
        this.calculator.updateDisplay();
    }

    executeCalc(option) {
        const func = this.calculator.graphingEngine.functions[0];
        if (!func) {
            this.calculator.currentInput = 'No function';
            this.calculator.updateDisplay();
            return;
        }

        const win = this.calculator.graphingEngine.window;
        const mathModule = this.calculator.mathModule;

        switch(option) {
            case 1: // Value
                this.calcValue(func);
                break;
            case 2: // Zero
                this.calcZero(func);
                break;
            case 3: // Minimum
                this.calcMinimum(func);
                break;
            case 4: // Maximum
                this.calcMaximum(func);
                break;
            case 5: // Intersect
                this.calcIntersect();
                break;
            case 6: // Derivative
                this.calcDerivative(func);
                break;
            case 7: // Integral
                this.calcIntegral(func);
                break;
        }
    }

    calcValue(func) {
        // Demander X
        this.calculator.currentInput = 'X=?';
        this.calculator.currentMode = 'CALC_VALUE';
        this.calculator.updateDisplay();
    }

    calcValueResult(x) {
        const func = this.calculator.graphingEngine.functions[0];
        try {
            const y = this.calculator.graphingEngine.evaluateFunction(func, x);
            this.calculator.currentInput = `X=${x}\nY=${y.toFixed(6)}`;
            this.calculator.currentMode = 'NORMAL';
            this.calculator.updateDisplay();
        } catch (e) {
            this.calculator.currentInput = 'Error';
            this.calculator.updateDisplay();
        }
    }

    calcZero(func) {
        const win = this.calculator.graphingEngine.window;
        const zeros = this.calculator.graphingEngine.findZeros(func, win.xMin, win.xMax);

        if (zeros.length > 0) {
            const zero = zeros[0];
            const y = this.calculator.graphingEngine.evaluateFunction(func, zero);
            this.calculator.currentInput = `Zero:\nX=${zero.toFixed(6)}\nY=${y.toFixed(6)}`;
        } else {
            this.calculator.currentInput = 'No zero found';
        }
        this.calculator.updateDisplay();
    }

    calcMinimum(func) {
        const win = this.calculator.graphingEngine.window;
        const xMin = this.calculator.mathModule.fMin(func, win.xMin, win.xMax);
        const yMin = this.calculator.graphingEngine.evaluateFunction(func, xMin);

        this.calculator.currentInput = `Minimum:\nX=${xMin.toFixed(6)}\nY=${yMin.toFixed(6)}`;
        this.calculator.updateDisplay();

        // Marquer le point sur le graphique
        this.markPoint(xMin, yMin);
    }

    calcMaximum(func) {
        const win = this.calculator.graphingEngine.window;
        const xMax = this.calculator.mathModule.fMax(func, win.xMin, win.xMax);
        const yMax = this.calculator.graphingEngine.evaluateFunction(func, xMax);

        this.calculator.currentInput = `Maximum:\nX=${xMax.toFixed(6)}\nY=${yMax.toFixed(6)}`;
        this.calculator.updateDisplay();

        // Marquer le point sur le graphique
        this.markPoint(xMax, yMax);
    }

    calcIntersect() {
        const func1 = this.calculator.graphingEngine.functions[0];
        const func2 = this.calculator.graphingEngine.functions[1];

        if (!func1 || !func2) {
            this.calculator.currentInput = 'Need 2 functions';
            this.calculator.updateDisplay();
            return;
        }

        // Trouver l'intersection en résolvant f1(x) - f2(x) = 0
        const diffFunc = `(${func1})-(${func2})`;
        const win = this.calculator.graphingEngine.window;
        const xIntersect = this.calculator.mathModule.solve(diffFunc, (win.xMin + win.xMax) / 2);

        if (isNaN(xIntersect)) {
            this.calculator.currentInput = 'No intersection found';
        } else {
            const yIntersect = this.calculator.graphingEngine.evaluateFunction(func1, xIntersect);
            this.calculator.currentInput = `Intersection:\nX=${xIntersect.toFixed(6)}\nY=${yIntersect.toFixed(6)}`;
            this.markPoint(xIntersect, yIntersect);
        }
        this.calculator.updateDisplay();
    }

    calcDerivative(func) {
        this.calculator.currentInput = 'X=?';
        this.calculator.currentMode = 'CALC_DERIV';
        this.calculator.updateDisplay();
    }

    calcDerivativeResult(x) {
        const func = this.calculator.graphingEngine.functions[0];
        const derivative = this.calculator.mathModule.nDeriv(func, x);

        this.calculator.currentInput = `dy/dx at X=${x}\n=${derivative.toFixed(6)}`;
        this.calculator.currentMode = 'NORMAL';
        this.calculator.updateDisplay();
    }

    calcIntegral(func) {
        this.calculator.currentInput = 'Lower=?';
        this.calculator.currentMode = 'CALC_INTEGRAL_LOWER';
        this.calculator.updateDisplay();
    }

    calcIntegralResult(lower, upper) {
        const func = this.calculator.graphingEngine.functions[0];
        const integral = this.calculator.mathModule.fnInt(func, lower, upper);

        this.calculator.currentInput = `∫f(x)dx from ${lower} to ${upper}\n=${integral.toFixed(6)}`;
        this.calculator.currentMode = 'NORMAL';
        this.calculator.updateDisplay();

        // Ombrer la région
        this.shadeRegion(func, lower, upper);
    }

    markPoint(x, y) {
        const ctx = this.calculator.graphingEngine.ctx;
        const pixelX = this.calculator.graphingEngine.xToPixel(x);
        const pixelY = this.calculator.graphingEngine.yToPixel(y);

        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(pixelX, pixelY, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pixelX - 6, pixelY - 6);
        ctx.lineTo(pixelX + 6, pixelY + 6);
        ctx.moveTo(pixelX + 6, pixelY - 6);
        ctx.lineTo(pixelX - 6, pixelY + 6);
        ctx.stroke();
    }

    shadeRegion(func, lower, upper) {
        const ctx = this.calculator.graphingEngine.ctx;
        const graphEngine = this.calculator.graphingEngine;

        ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
        ctx.beginPath();

        const lowerPixel = graphEngine.xToPixel(lower);
        const upperPixel = graphEngine.xToPixel(upper);

        // Commencer en bas
        ctx.moveTo(lowerPixel, graphEngine.yToPixel(0));

        // Tracer la courbe
        for (let px = lowerPixel; px <= upperPixel; px++) {
            const x = graphEngine.pixelToX(px);
            const y = graphEngine.evaluateFunction(func, x);
            const py = graphEngine.yToPixel(y);
            ctx.lineTo(px, py);
        }

        // Revenir en bas
        ctx.lineTo(upperPixel, graphEngine.yToPixel(0));
        ctx.closePath();
        ctx.fill();
    }
}
