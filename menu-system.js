// Système de menus pour TI-83 Plus
class MenuSystem {
    constructor(calculator) {
        this.calculator = calculator;
        this.currentMenu = null;
        this.menuStack = [];
        this.selectedIndex = 0;
        this.menuElement = null;
        this.createMenuElement();
    }

    createMenuElement() {
        // Créer l'élément DOM pour les menus
        this.menuElement = document.createElement('div');
        this.menuElement.id = 'menu-overlay';
        this.menuElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #9ca99c;
            border: 2px solid #2c3e50;
            border-radius: 5px;
            padding: 10px;
            min-width: 200px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #000;
            z-index: 1000;
            display: none;
        `;

        document.querySelector('.screen-container').appendChild(this.menuElement);
    }

    showMenu(title, items, callback) {
        this.currentMenu = {
            title,
            items,
            callback
        };
        this.selectedIndex = 0;
        this.renderMenu();
        this.menuElement.style.display = 'block';
    }

    renderMenu() {
        if (!this.currentMenu) return;

        let html = `<div style="font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 5px; padding-bottom: 5px;">`;
        html += `${this.currentMenu.title}</div>`;

        this.currentMenu.items.forEach((item, index) => {
            const selected = index === this.selectedIndex ? '►' : ' ';
            const style = index === this.selectedIndex ? 'background: #7f8c8d; color: #fff;' : '';
            html += `<div style="padding: 3px; ${style}">${selected} ${item}</div>`;
        });

        html += `<div style="margin-top: 10px; font-size: 10px; border-top: 1px solid #000; padding-top: 5px;">`;
        html += `▲▼: Navigate  ENTER: Select  CLEAR: Exit</div>`;

        this.menuElement.innerHTML = html;
    }

    navigateMenu(direction) {
        if (!this.currentMenu) return;

        this.selectedIndex += direction;
        this.selectedIndex = Math.max(0, Math.min(this.currentMenu.items.length - 1, this.selectedIndex));
        this.renderMenu();
    }

    selectMenuItem() {
        if (!this.currentMenu) return;

        const selectedItem = this.currentMenu.items[this.selectedIndex];

        // Extraire le numéro ou la lettre du menu
        const match = selectedItem.match(/^([0-9A-Z]):/);
        if (match && this.currentMenu.callback) {
            const choice = match[1];
            this.currentMenu.callback(isNaN(choice) ? choice : parseInt(choice));
        }

        this.closeMenu();
    }

    closeMenu() {
        this.menuElement.style.display = 'none';
        this.currentMenu = null;
        this.selectedIndex = 0;
    }

    // Menus spécifiques

    showModeMenu() {
        const items = [
            'Normal',
            'Sci',
            'Eng',
            'Float',
            'Fix',
            'Radian',
            'Degree',
            'Func',
            'Par',
            'Pol',
            'Seq',
            'Connected',
            'Dot',
            'Sequential',
            'Simul',
            'Real',
            'a+bi',
            're^θi',
            'Full',
            'Horiz',
            'G-T'
        ];

        this.showMenu('MODE', items.map((item, i) => `${i}: ${item}`), (choice) => {
            switch(choice) {
                case 5:
                    this.calculator.angleMode = 'RAD';
                    break;
                case 6:
                    this.calculator.angleMode = 'DEG';
                    break;
            }
            this.calculator.updateIndicators();
        });
    }

    showAppsMenu() {
        const items = [
            '1: Finance',
            '2: CellSheet',
            '3: Inequalz',
            '4: PlySmlt2',
            '5: Periodic',
            '6: Science',
            '7: Cabri Jr'
        ];

        this.showMenu('APPS', items);
    }

    showPrgmMenu() {
        const items = [
            'EXEC EDIT NEW',
            '(No programs stored)'
        ];

        this.showMenu('PRGM', items);
    }

    showVarsMenu() {
        const items = [
            '1: Window...',
            '2: Zoom...',
            '3: GDB...',
            '4: Picture...',
            '5: Statistics...',
            '6: Table...',
            '7: String...'
        ];

        this.showMenu('VARS', items, (choice) => {
            switch(choice) {
                case 1:
                    this.showWindowVars();
                    break;
                case 2:
                    this.showZoomVars();
                    break;
                case 5:
                    this.showStatVars();
                    break;
            }
        });
    }

    showWindowVars() {
        const win = this.calculator.graphingEngine.window;
        const items = [
            `1: Xmin=${win.xMin}`,
            `2: Xmax=${win.xMax}`,
            `3: Xscl=${win.xScale}`,
            `4: Ymin=${win.yMin}`,
            `5: Ymax=${win.yMax}`,
            `6: Yscl=${win.yScale}`
        ];

        this.showMenu('WINDOW VARS', items, (choice) => {
            const vars = ['xMin', 'xMax', 'xScale', 'yMin', 'yMax', 'yScale'];
            if (choice >= 1 && choice <= 6) {
                this.calculator.currentInput += vars[choice - 1];
                this.calculator.updateDisplay();
            }
        });
    }

    showZoomVars() {
        const items = [
            '1: ZXmin',
            '2: ZXmax',
            '3: ZXscl',
            '4: ZYmin',
            '5: ZYmax',
            '6: ZYscl'
        ];

        this.showMenu('ZOOM VARS', items);
    }

    showStatVars() {
        const stats = this.calculator.statModule?.statVars;
        if (!stats) {
            this.showMenu('STAT VARS', ['No statistics calculated']);
            return;
        }

        const items = [
            `1: n=${stats.n}`,
            `2: x̄=${stats.mean.toFixed(4)}`,
            `3: Σx=${stats.sum.toFixed(4)}`,
            `4: Sx=${stats.stdDev.toFixed(4)}`,
            `5: σx=${stats.stdDevPop.toFixed(4)}`,
            `6: min=${stats.min}`,
            `7: max=${stats.max}`
        ];

        this.showMenu('STAT VARS', items);
    }

    // Menu CATALOG
    showCatalogMenu() {
        const functions = [
            'abs(',
            'acos(',
            'and',
            'angle(',
            'Ans',
            'asin(',
            'atan(',
            'atanh(',
            'augment(',
            'bal(',
            'binomcdf(',
            'binompdf(',
            'checkTmr(',
            'χ²cdf(',
            'χ²pdf(',
            'Circle(',
            'ClrAllLists',
            'ClrDraw',
            'ClrHome',
            'ClrList',
            'ClrTable',
            'conj(',
            'cos(',
            'cosh(',
            'cumSum(',
            'dayOfWk(',
            'dbd(',
            'Degree',
            'DelVar',
            'DependAsk',
            'DependAuto',
            'det(',
            'DiagnosticOff',
            'DiagnosticOn',
            'dim(',
            'Disp',
            'DispGraph',
            'DispTable',
            'e',
            'e^(',
            'Else',
            'End',
            'Eng',
            'expr(',
            'ExpReg',
            'Fcdf(',
            'Fill(',
            'Fix',
            'Float',
            'fMax(',
            'fMin(',
            'fnInt(',
            'fPart(',
            'FV',
            'gcd(',
            'geometcdf(',
            'geometpdf(',
            'Get(',
            'GetCalc(',
            'getDate',
            'getKey',
            'getTime',
            'gcd(',
            'Horiz',
            'i',
            'identity(',
            'If',
            'imag(',
            'IndpntAsk',
            'IndpntAuto',
            'Input',
            'int(',
            'inString(',
            'invNorm(',
            'iPart(',
            'irr(',
            'IS>(',
            'lcm(',
            'length(',
            'Line(',
            'LinReg',
            'LinRegTTest',
            'List►matr',
            'ln(',
            'LnReg',
            'log(',
            'Logistic',
            'Manual-Fit',
            'matr►list',
            'max(',
            'mean(',
            'median(',
            'Med-Med',
            'Menu(',
            'min(',
            'nCr',
            'nDeriv(',
            'normalcdf(',
            'normalpdf(',
            'not(',
            'nPr',
            'npv(',
            'or',
            'Output(',
            'Param',
            'Pause',
            'P►Rx(',
            'P►Ry(',
            'Plot1(',
            'Plot2(',
            'Plot3(',
            'Pmt_Bgn',
            'Pmt_End',
            'poisscdf(',
            'poisspdf(',
            'Polar',
            'PolarGC',
            'Prompt',
            'Pmt',
            'Pv',
            'PwrReg',
            'Pt-Change(',
            'Pt-Off(',
            'Pt-On(',
            'Pxl-Change(',
            'Pxl-Off(',
            'Pxl-On(',
            'Pxl-Test(',
            'QuadReg',
            'QuartReg',
            'Radian',
            'rand',
            'randBin(',
            'randInt(',
            'randM(',
            'randNorm(',
            'real(',
            'Real',
            're^θi',
            'RecallGDB',
            'RecallPic',
            'RectGC',
            'ref(',
            'remainder(',
            'Return',
            'round(',
            'R►Pθ(',
            'R►Pr(',
            'rref(',
            'Sci',
            'Select(',
            'Send(',
            'seq(',
            'Seq',
            'setDate(',
            'setTime(',
            'Simul',
            'sin(',
            'sinh(',
            'SinReg',
            'solve(',
            'SortA(',
            'SortD(',
            'sqrt(',
            'stdDev(',
            'Stop',
            'Store',
            'StoreGDB',
            'StorePic',
            'String►Equ(',
            'sub(',
            'sum(',
            'tan(',
            'tangent(',
            'tanh(',
            'tcdf(',
            'Text(',
            'Then',
            'Time',
            'tpdf(',
            'Trace',
            'Txt',
            'UnArchive',
            'uvAxes',
            'uwAxes',
            'variance(',
            'Vertical',
            'vwAxes',
            'Web',
            'While',
            'xor',
            'ZBox',
            'ZDecimal',
            'ZInteger',
            'ZoomFit',
            'ZoomRcl',
            'ZoomStat',
            'ZoomSto',
            'ZPrevious',
            'ZSquare',
            'ZStandard',
            'ZTrig'
        ];

        let startIndex = 0;
        const itemsPerPage = 10;

        const showPage = (start) => {
            const pageItems = functions.slice(start, start + itemsPerPage);
            const menuItems = pageItems.map((f, i) => `${i}: ${f}`);

            if (start + itemsPerPage < functions.length) {
                menuItems.push('▼ More...');
            }
            if (start > 0) {
                menuItems.push('▲ Previous...');
            }

            this.showMenu(`CATALOG (${start + 1}-${Math.min(start + itemsPerPage, functions.length)})`, menuItems, (choice) => {
                if (choice === 10 && start + itemsPerPage < functions.length) {
                    showPage(start + itemsPerPage);
                } else if (choice === 11 && start > 0) {
                    showPage(Math.max(0, start - itemsPerPage));
                } else if (choice >= 0 && choice < pageItems.length) {
                    this.calculator.currentInput += pageItems[choice];
                    this.calculator.updateDisplay();
                }
            });
        };

        showPage(0);
    }

    // Menu TEST (comparaisons et logique)
    showTestMenu() {
        const items = [
            'TEST LOGIC',
            '1: =',
            '2: ≠',
            '3: >',
            '4: ≥',
            '5: <',
            '6: ≤'
        ];

        this.showMenu('TEST', items, (choice) => {
            const operators = ['=', '≠', '>', '≥', '<', '≤'];
            if (choice >= 1 && choice <= 6) {
                this.calculator.inputOperator(operators[choice - 1]);
            }
        });
    }

    showLogicMenu() {
        const items = [
            'LOGIC',
            '1: and',
            '2: or',
            '3: xor',
            '4: not('
        ];

        this.showMenu('LOGIC', items, (choice) => {
            const operators = ['and', 'or', 'xor', 'not('];
            if (choice >= 1 && choice <= 4) {
                this.calculator.inputFunction(operators[choice - 1]);
            }
        });
    }

    // Menu ANGLE
    showAngleMenu() {
        const items = [
            '1: °',
            '2: \'',
            '3: r',
            '4: ►DMS',
            '5: R►Pr(',
            '6: R►Pθ(',
            '7: P►Rx(',
            '8: P►Ry('
        ];

        this.showMenu('ANGLE', items, (choice) => {
            switch(choice) {
                case 1:
                    this.calculator.currentInput += '°';
                    break;
                case 2:
                    this.calculator.currentInput += '\'';
                    break;
                case 3:
                    this.calculator.currentInput += 'r';
                    break;
            }
            this.calculator.updateDisplay();
        });
    }
}
