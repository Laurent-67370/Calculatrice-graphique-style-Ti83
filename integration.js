// Fichier d'intégration - Connecte tous les modules
document.addEventListener('DOMContentLoaded', () => {
    // Attendre que la calculatrice soit initialisée
    setTimeout(() => {
        if (window.calculator) {
            // Initialiser tous les modules
            calculator.statModule = new StatisticsModule(calculator);
            calculator.mathModule = new MathFunctionsModule(calculator);
            calculator.editorsModule = new EditorsModule(calculator);
            calculator.menuSystem = new MenuSystem(calculator);

            // Référence pour le moteur graphique
            calculator.graphingEngine = window.graphingEngine;

            // Ajouter la méthode showMenu au calculateur
            calculator.showMenu = function(title, items, callback) {
                this.menuSystem.showMenu(title, items, callback);
            };

            // Étendre le gestionnaire de touches
            const originalHandleKeyPress = calculator.handleKeyPress.bind(calculator);

            calculator.handleKeyPress = function(action) {
                // Gérer les menus ouverts
                if (this.menuSystem.currentMenu) {
                    switch(action) {
                        case 'up':
                            this.menuSystem.navigateMenu(-1);
                            return;
                        case 'down':
                            this.menuSystem.navigateMenu(1);
                            return;
                        case 'enter':
                            this.menuSystem.selectMenuItem();
                            return;
                        case 'clear':
                            this.menuSystem.closeMenu();
                            return;
                        default:
                            return;
                    }
                }

                // Gérer les modes spéciaux d'édition
                if (this.currentMode === 'Y_EDITOR') {
                    handleYEditorMode.call(this, action);
                    return;
                }

                if (this.currentMode === 'Y_EDIT') {
                    handleYEditMode.call(this, action);
                    return;
                }

                if (this.currentMode === 'WINDOW') {
                    handleWindowMode.call(this, action);
                    return;
                }

                if (this.currentMode === 'WINDOW_EDIT') {
                    handleWindowEditMode.call(this, action);
                    return;
                }

                if (this.currentMode === 'TABLE') {
                    handleTableMode.call(this, action);
                    return;
                }

                if (this.currentMode === 'STAT_EDIT') {
                    handleStatEditMode.call(this, action);
                    return;
                }

                if (this.currentMode === 'CALC_VALUE') {
                    if (action === 'enter') {
                        this.editorsModule.calcValueResult(parseFloat(this.currentInput));
                        return;
                    }
                }

                if (this.currentMode === 'CALC_DERIV') {
                    if (action === 'enter') {
                        this.editorsModule.calcDerivativeResult(parseFloat(this.currentInput));
                        return;
                    }
                }

                if (this.currentMode === 'CALC_INTEGRAL_LOWER') {
                    if (action === 'enter') {
                        this.integralLower = parseFloat(this.currentInput);
                        this.currentInput = 'Upper=?';
                        this.currentMode = 'CALC_INTEGRAL_UPPER';
                        this.updateDisplay();
                        return;
                    }
                }

                if (this.currentMode === 'CALC_INTEGRAL_UPPER') {
                    if (action === 'enter') {
                        const upper = parseFloat(this.currentInput);
                        this.editorsModule.calcIntegralResult(this.integralLower, upper);
                        return;
                    }
                }

                // Actions normales avec extensions
                switch(action) {
                    case 'y-vars':
                        this.editorsModule.openYEditor();
                        break;

                    case 'window':
                        this.editorsModule.openWindowEditor();
                        break;

                    case 'zoom':
                        this.editorsModule.openZoomMenu();
                        break;

                    case 'trace':
                        if (this.isGraphMode) {
                            this.graphingEngine.enableTrace();
                        }
                        break;

                    case 'graph':
                        this.toggleGraphMode();
                        break;

                    case 'mode':
                        this.menuSystem.showModeMenu();
                        break;

                    case 'stat':
                        this.statModule.showStatMenu();
                        break;

                    case 'math':
                        this.mathModule.showMathMenu();
                        break;

                    case 'apps':
                        this.menuSystem.showAppsMenu();
                        break;

                    case 'prgm':
                        this.menuSystem.showPrgmMenu();
                        break;

                    case 'vars':
                        this.menuSystem.showVarsMenu();
                        break;

                    default:
                        originalHandleKeyPress(action);
                }
            };

            // Fonctions de gestion des modes

            function handleYEditorMode(action) {
                switch(action) {
                    case 'up':
                        this.editorsModule.navigateY(-1);
                        break;
                    case 'down':
                        this.editorsModule.navigateY(1);
                        break;
                    case 'enter':
                        this.editorsModule.editYFunction(this.editorsModule.cursorY);
                        break;
                    case 'clear':
                        this.currentMode = 'NORMAL';
                        this.clear();
                        break;
                    case 'del':
                        // Toggle fonction active/inactive
                        this.editorsModule.toggleYFunction(this.editorsModule.cursorY);
                        break;
                    default:
                        break;
                }
            }

            function handleYEditMode(action) {
                if (action === 'enter') {
                    this.editorsModule.saveYFunction();
                } else if (action === 'clear') {
                    this.currentMode = 'Y_EDITOR';
                    this.editorsModule.displayYEditor();
                } else {
                    originalHandleKeyPress(action);
                }
            }

            function handleWindowMode(action) {
                switch(action) {
                    case 'up':
                        this.editorsModule.navigateWindow(-1);
                        break;
                    case 'down':
                        this.editorsModule.navigateWindow(1);
                        break;
                    case 'enter':
                        this.editorsModule.editWindowSetting(this.editorsModule.cursorY);
                        break;
                    case 'clear':
                        this.currentMode = 'NORMAL';
                        this.clear();
                        break;
                    default:
                        break;
                }
            }

            function handleWindowEditMode(action) {
                if (action === 'enter') {
                    this.editorsModule.saveWindowSetting();
                } else if (action === 'clear') {
                    this.currentMode = 'WINDOW';
                    this.editorsModule.displayWindowEditor();
                } else {
                    originalHandleKeyPress(action);
                }
            }

            function handleTableMode(action) {
                switch(action) {
                    case 'up':
                        this.editorsModule.scrollTable(-1);
                        break;
                    case 'down':
                        this.editorsModule.scrollTable(1);
                        break;
                    case 'clear':
                        this.currentMode = 'NORMAL';
                        this.clear();
                        break;
                    default:
                        break;
                }
            }

            function handleStatEditMode(action) {
                if (action === 'up') {
                    this.statModule.currentIndex = Math.max(0, this.statModule.currentIndex - 1);
                    this.statModule.displayListEditor();
                } else if (action === 'down') {
                    this.statModule.currentIndex++;
                    this.statModule.displayListEditor();
                } else if (action === 'enter') {
                    if (this.currentInput && this.currentInput !== '0') {
                        this.statModule.addToList(this.currentInput);
                        this.currentInput = '0';
                    }
                } else if (action === 'del') {
                    this.statModule.deleteFromList(this.statModule.currentIndex);
                } else if (action === 'clear') {
                    this.currentMode = 'NORMAL';
                    this.clear();
                } else {
                    originalHandleKeyPress(action);
                }
            }

            // Étendre handleSecondaryFunction
            const originalHandleSecondary = calculator.handleSecondaryFunction.bind(calculator);

            calculator.handleSecondaryFunction = function(action) {
                switch(action) {
                    case 'stat':
                        this.statModule.showCalcMenu();
                        break;
                    case 'math':
                        this.menuSystem.showTestMenu();
                        break;
                    case 'apps':
                        this.menuSystem.showAngleMenu();
                        break;
                    case 'prgm':
                        this.menuSystem.showMenu('DRAW', [
                            '1: ClrDraw',
                            '2: Line(',
                            '3: Horizontal',
                            '4: Vertical',
                            '5: Tangent(',
                            '6: DrawF',
                            '7: Shade(',
                            '8: DrawInv',
                            '9: Circle(',
                            '0: Text('
                        ]);
                        break;
                    case 'vars':
                        this.mathModule.showDistrMenu();
                        break;
                    case 'window':
                        this.editorsModule.openTableSetup();
                        break;
                    case 'zoom':
                        this.editorsModule.openFormatMenu();
                        break;
                    case 'trace':
                        this.editorsModule.openCalcMenu();
                        break;
                    case 'graph':
                        this.editorsModule.showTable();
                        break;
                    case '0':
                        this.menuSystem.showCatalogMenu();
                        break;
                    case 'add':
                        // MEM (Memory)
                        this.menuSystem.showMenu('MEMORY', [
                            '1: About',
                            '2: Mem Mgmt/Del',
                            '3: Clear Entries',
                            '4: ClrAllLists',
                            '5: Archive',
                            '6: UnArchive',
                            '7: Reset'
                        ]);
                        break;
                    default:
                        originalHandleSecondary(action);
                }
            };

            // Améliorer evaluateExpression pour supporter les nouvelles fonctions
            const originalEvaluate = calculator.evaluateExpression.bind(calculator);

            calculator.evaluateExpression = function(expr) {
                // Ajouter le support des nouvelles fonctions
                expr = expr
                    // Fonctions numériques
                    .replace(/abs\(/g, 'Math.abs(')
                    .replace(/round\(/g, 'Math.round(')
                    .replace(/iPart\(/g, 'Math.trunc(')
                    .replace(/fPart\(([^)]+)\)/g, '(($1) - Math.trunc($1))')
                    .replace(/int\(/g, 'Math.floor(')
                    .replace(/min\(/g, 'Math.min(')
                    .replace(/max\(/g, 'Math.max(')
                    // Racine cubique
                    .replace(/∛\(/g, 'Math.cbrt(')
                    .replace(/³√\(/g, 'Math.cbrt(')
                    // Factorielle
                    .replace(/(\d+)!/g, (match, n) => {
                        return this.mathModule.factorial(parseInt(n)).toString();
                    })
                    // Permutations et combinaisons
                    .replace(/nPr\(([^,]+),([^)]+)\)/g, (match, n, r) => {
                        return this.mathModule.nPr(parseFloat(n), parseFloat(r)).toString();
                    })
                    .replace(/nCr\(([^,]+),([^)]+)\)/g, (match, n, r) => {
                        return this.mathModule.nCr(parseFloat(n), parseFloat(r)).toString();
                    });

                return originalEvaluate(expr);
            };

            // Ajouter des raccourcis clavier supplémentaires
            document.addEventListener('keydown', (e) => {
                if (calculator.currentMode === 'Y_EDITOR' || calculator.currentMode === 'WINDOW' || calculator.currentMode === 'TABLE') {
                    if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        calculator.handleKeyPress('up');
                    } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        calculator.handleKeyPress('down');
                    }
                }

                // Raccourcis pour les fonctions courantes
                if (e.altKey) {
                    e.preventDefault();
                    switch(e.key) {
                        case 'y':
                            calculator.editorsModule.openYEditor();
                            break;
                        case 'w':
                            calculator.editorsModule.openWindowEditor();
                            break;
                        case 'g':
                            calculator.toggleGraphMode();
                            break;
                        case 't':
                            calculator.editorsModule.showTable();
                            break;
                        case 'z':
                            calculator.editorsModule.openZoomMenu();
                            break;
                        case 's':
                            calculator.statModule.showStatMenu();
                            break;
                        case 'm':
                            calculator.mathModule.showMathMenu();
                            break;
                    }
                }

                // Aide contextuelle
                if (e.key === 'F1') {
                    e.preventDefault();
                    showHelp();
                }
            });

            // Fonction d'aide
            function showHelp() {
                const helpText = `
TI-83 Plus - Aide Rapide

RACCOURCIS CLAVIER:
Alt+Y: Y= Editor
Alt+W: Window
Alt+G: Graph
Alt+T: Table
Alt+Z: Zoom
Alt+S: Stat
Alt+M: Math
F1: Aide

NAVIGATION:
▲▼: Navigate menus
←→: Move in graph/trace
ENTER: Confirm
CLEAR: Cancel/Exit

MODES DISPONIBLES:
- Y= : Éditer les fonctions
- WINDOW : Paramètres fenêtre
- ZOOM : Zoom presets
- TABLE : Table de valeurs
- STAT : Statistiques
- MATH : Fonctions mathématiques
- CALC : Analyse graphique
                `.trim();

                calculator.currentInput = helpText;
                calculator.updateDisplay();

                setTimeout(() => {
                    calculator.clear();
                }, 10000);
            }

            // Message de bienvenue
            setTimeout(() => {
                calculator.historyDisplay.textContent = 'TI-83 Plus Ready\nPress F1 for help';
            }, 1000);

            console.log('✓ Tous les modules TI-83 Plus chargés');
            console.log('✓ Fonctionnalités disponibles:');
            console.log('  - Calcul scientifique avancé');
            console.log('  - Mode graphique complet');
            console.log('  - Statistiques et régressions');
            console.log('  - Dérivées et intégrales numériques');
            console.log('  - Nombres complexes');
            console.log('  - Probabilités et combinatoire');
            console.log('  - Menus MATH, STAT, CALC');
            console.log('  - Éditeurs Y=, WINDOW, TABLE');
        }
    }, 200);
});
