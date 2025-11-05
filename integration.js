// Fichier d'intégration corrigé - Connecte tous les modules
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Initialisation de la calculatrice TI-83 Plus...');

    // Attendre que tous les modules soient chargés
    setTimeout(() => {
        try {
            // Vérifier que la calculatrice et le moteur graphique existent
            if (!window.calculator) {
                console.error('❌ Erreur: calculator non trouvé');
                return;
            }

            if (!window.graphingEngine) {
                console.error('❌ Erreur: graphingEngine non trouvé');
                return;
            }

            console.log('✓ calculator et graphingEngine chargés');

            // Référence pour le moteur graphique
            calculator.graphingEngine = window.graphingEngine;

            // Initialiser tous les modules
            console.log('📦 Chargement des modules...');

            try {
                calculator.statModule = new StatisticsModule(calculator);
                console.log('✓ Module statistiques chargé');
            } catch (e) {
                console.error('❌ Erreur module statistiques:', e);
            }

            try {
                calculator.mathModule = new MathFunctionsModule(calculator);
                console.log('✓ Module math chargé');
            } catch (e) {
                console.error('❌ Erreur module math:', e);
            }

            try {
                calculator.editorsModule = new EditorsModule(calculator);
                console.log('✓ Module éditeurs chargé');
            } catch (e) {
                console.error('❌ Erreur module éditeurs:', e);
            }

            try {
                calculator.menuSystem = new MenuSystem(calculator);
                console.log('✓ Système de menus chargé');
            } catch (e) {
                console.error('❌ Erreur système menus:', e);
            }

            // Ajouter la méthode showMenu au calculateur
            calculator.showMenu = function(title, items, callback) {
                if (this.menuSystem) {
                    this.menuSystem.showMenu(title, items, callback);
                }
            };

            // Sauvegarder les méthodes originales
            const originalHandleKeyPress = calculator.handleKeyPress.bind(calculator);
            const originalHandleSecondary = calculator.handleSecondaryFunction.bind(calculator);
            const originalEvaluate = calculator.evaluateExpression.bind(calculator);

            // Étendre le gestionnaire de touches
            calculator.handleKeyPress = function(action) {
                // Gérer les menus ouverts
                if (this.menuSystem && this.menuSystem.currentMenu) {
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
                if (this.editorsModule) {
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
                }

                // Actions normales avec extensions
                switch(action) {
                    case 'y-vars':
                        if (this.editorsModule) {
                            this.editorsModule.openYEditor();
                        } else {
                            console.log('Y= demandé');
                        }
                        break;

                    case 'window':
                        if (this.editorsModule) {
                            this.editorsModule.openWindowEditor();
                        } else {
                            console.log('WINDOW demandé');
                        }
                        break;

                    case 'zoom':
                        if (this.editorsModule) {
                            this.editorsModule.openZoomMenu();
                        } else {
                            console.log('ZOOM demandé');
                        }
                        break;

                    case 'trace':
                        if (this.isGraphMode && this.graphingEngine) {
                            this.graphingEngine.enableTrace();
                        }
                        break;

                    case 'graph':
                        this.toggleGraphMode();
                        break;

                    case 'mode':
                        if (this.menuSystem) {
                            this.menuSystem.showModeMenu();
                        } else {
                            originalHandleKeyPress(action);
                        }
                        break;

                    case 'stat':
                        if (this.statModule) {
                            this.statModule.showStatMenu();
                        } else {
                            originalHandleKeyPress(action);
                        }
                        break;

                    case 'math':
                        if (this.mathModule) {
                            this.mathModule.showMathMenu();
                        } else {
                            originalHandleKeyPress(action);
                        }
                        break;

                    case 'apps':
                        if (this.menuSystem) {
                            this.menuSystem.showAppsMenu();
                        } else {
                            originalHandleKeyPress(action);
                        }
                        break;

                    case 'prgm':
                        if (this.menuSystem) {
                            this.menuSystem.showPrgmMenu();
                        } else {
                            originalHandleKeyPress(action);
                        }
                        break;

                    case 'vars':
                        if (this.menuSystem) {
                            this.menuSystem.showVarsMenu();
                        } else {
                            originalHandleKeyPress(action);
                        }
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
            calculator.handleSecondaryFunction = function(action) {
                switch(action) {
                    case 'stat':
                        if (this.statModule) {
                            this.statModule.showCalcMenu();
                        }
                        break;
                    case 'math':
                        if (this.menuSystem) {
                            this.menuSystem.showTestMenu();
                        }
                        break;
                    case 'apps':
                        if (this.menuSystem) {
                            this.menuSystem.showAngleMenu();
                        }
                        break;
                    case 'prgm':
                        if (this.menuSystem) {
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
                        }
                        break;
                    case 'vars':
                        if (this.mathModule) {
                            this.mathModule.showDistrMenu();
                        }
                        break;
                    case 'window':
                        if (this.editorsModule) {
                            this.editorsModule.openTableSetup();
                        }
                        break;
                    case 'zoom':
                        if (this.editorsModule) {
                            this.editorsModule.openFormatMenu();
                        }
                        break;
                    case 'trace':
                        if (this.editorsModule) {
                            this.editorsModule.openCalcMenu();
                        }
                        break;
                    case 'graph':
                        if (this.editorsModule) {
                            this.editorsModule.showTable();
                        }
                        break;
                    case '0':
                        if (this.menuSystem) {
                            this.menuSystem.showCatalogMenu();
                        }
                        break;
                    case 'add':
                        if (this.menuSystem) {
                            this.menuSystem.showMenu('MEMORY', [
                                '1: About',
                                '2: Mem Mgmt/Del',
                                '3: Clear Entries',
                                '4: ClrAllLists',
                                '5: Archive',
                                '6: UnArchive',
                                '7: Reset'
                            ]);
                        }
                        break;
                    default:
                        originalHandleSecondary(action);
                }
            };

            // Améliorer evaluateExpression pour supporter les nouvelles fonctions
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
                    .replace(/³√\(/g, 'Math.cbrt(');

                // Factorielle
                if (this.mathModule && /\d+!/.test(expr)) {
                    expr = expr.replace(/(\d+)!/g, (match, n) => {
                        return this.mathModule.factorial(parseInt(n)).toString();
                    });
                }

                // Permutations et combinaisons
                if (this.mathModule) {
                    expr = expr.replace(/nPr\(([^,]+),([^)]+)\)/g, (match, n, r) => {
                        return this.mathModule.nPr(parseFloat(n), parseFloat(r)).toString();
                    });
                    expr = expr.replace(/nCr\(([^,]+),([^)]+)\)/g, (match, n, r) => {
                        return this.mathModule.nCr(parseFloat(n), parseFloat(r)).toString();
                    });
                }

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
                if (e.altKey && !e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    switch(e.key.toLowerCase()) {
                        case 'y':
                            if (calculator.editorsModule) {
                                calculator.editorsModule.openYEditor();
                            }
                            break;
                        case 'w':
                            if (calculator.editorsModule) {
                                calculator.editorsModule.openWindowEditor();
                            }
                            break;
                        case 'g':
                            calculator.toggleGraphMode();
                            break;
                        case 't':
                            if (calculator.editorsModule) {
                                calculator.editorsModule.showTable();
                            }
                            break;
                        case 'z':
                            if (calculator.editorsModule) {
                                calculator.editorsModule.openZoomMenu();
                            }
                            break;
                        case 's':
                            if (calculator.statModule) {
                                calculator.statModule.showStatMenu();
                            }
                            break;
                        case 'm':
                            if (calculator.mathModule) {
                                calculator.mathModule.showMathMenu();
                            }
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
                const helpText = `TI-83 Plus - Aide Rapide

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

TOUCHES:
Y=: Éditer fonctions
WINDOW: Paramètres fenêtre
GRAPH: Tracer graphique
TRACE: Mode trace
ZOOM: Options zoom
STAT: Statistiques
MATH: Fonctions math
2nd+TRACE: CALC menu`;

                calculator.currentInput = helpText;
                calculator.updateDisplay();

                setTimeout(() => {
                    calculator.clear();
                }, 10000);
            }

            // Message de bienvenue
            setTimeout(() => {
                if (calculator.historyDisplay) {
                    calculator.historyDisplay.textContent = 'TI-83 Plus v2.0\nPress F1 for help';
                }
            }, 1000);

            console.log('✅ Tous les modules TI-83 Plus chargés avec succès!');
            console.log('📊 Fonctionnalités disponibles:');
            console.log('  ✓ Calcul scientifique avancé');
            console.log('  ✓ Mode graphique complet');
            console.log('  ✓ Statistiques et régressions');
            console.log('  ✓ Dérivées et intégrales');
            console.log('  ✓ Nombres complexes');
            console.log('  ✓ Probabilités');
            console.log('  ✓ Menus MATH, STAT, CALC');
            console.log('  ✓ Éditeurs Y=, WINDOW, TABLE');
            console.log('💡 Appuyez sur F1 pour l\'aide');

        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            console.error('Stack:', error.stack);
        }
    }, 300); // Augmenté à 300ms pour laisser le temps au chargement
});
