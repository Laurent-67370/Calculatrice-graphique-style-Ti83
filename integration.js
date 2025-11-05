// Fichier d'intégration simplifié - Connecte tous les modules
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

            // Sauvegarder la méthode originale handleKeyPress
            const originalHandleKeyPress = calculator.handleKeyPress.bind(calculator);

            // ÉTENDRE (et non remplacer) handleKeyPress pour gérer les modes spéciaux
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

                // Gérer les modes d'édition spéciaux
                if (this.editorsModule && this.currentMode) {
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

                // Appeler la fonction originale pour tout le reste
                originalHandleKeyPress(action);
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
                        originalHandleKeyPress(action);
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
                        if (this.statModule) {
                            this.statModule.showCalcMenu();
                        } else {
                            originalHandleSecondary(action);
                        }
                        break;
                    case 'math':
                        if (this.menuSystem) {
                            this.menuSystem.showTestMenu();
                        } else {
                            originalHandleSecondary(action);
                        }
                        break;
                    case 'apps':
                        if (this.menuSystem) {
                            this.menuSystem.showAngleMenu();
                        } else {
                            originalHandleSecondary(action);
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
                        } else {
                            originalHandleSecondary(action);
                        }
                        break;
                    case 'vars':
                        if (this.mathModule) {
                            this.mathModule.showDistrMenu();
                        } else {
                            originalHandleSecondary(action);
                        }
                        break;
                    case 'window':
                        if (this.editorsModule) {
                            this.editorsModule.openTableSetup();
                        } else {
                            originalHandleSecondary(action);
                        }
                        break;
                    case 'zoom':
                        if (this.editorsModule) {
                            this.editorsModule.openFormatMenu();
                        } else {
                            originalHandleSecondary(action);
                        }
                        break;
                    case 'trace':
                        if (this.editorsModule) {
                            this.editorsModule.openCalcMenu();
                        } else {
                            originalHandleSecondary(action);
                        }
                        break;
                    case 'graph':
                        if (this.editorsModule) {
                            this.editorsModule.showTable();
                        } else {
                            originalHandleSecondary(action);
                        }
                        break;
                    case '0':
                        if (this.menuSystem) {
                            this.menuSystem.showCatalogMenu();
                        } else {
                            originalHandleSecondary(action);
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
                        } else {
                            originalHandleSecondary(action);
                        }
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
                            calculator.handleKeyPress('y-vars');
                            break;
                        case 'w':
                            calculator.handleKeyPress('window');
                            break;
                        case 'g':
                            calculator.handleKeyPress('graph');
                            break;
                        case 't':
                            if (calculator.editorsModule) {
                                calculator.editorsModule.showTable();
                            }
                            break;
                        case 'z':
                            calculator.handleKeyPress('zoom');
                            break;
                        case 's':
                            calculator.handleKeyPress('stat');
                            break;
                        case 'm':
                            calculator.handleKeyPress('math');
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

RACCOURCIS:
Alt+Y: Y= Editor
Alt+W: WINDOW
Alt+G: GRAPH
Alt+T: TABLE
Alt+Z: ZOOM
Alt+S: STAT
Alt+M: MATH
F1: Aide

TOUCHES:
Y=: Éditer fonctions
WINDOW: Paramètres fenêtre
GRAPH: Tracer
TRACE: Mode trace
ZOOM: Options zoom
STAT: Statistiques
MATH: Fonctions math
2nd+TRACE: CALC
2nd+GRAPH: TABLE`;

                calculator.currentInput = helpText;
                calculator.updateDisplay();

                setTimeout(() => {
                    calculator.clear();
                }, 10000);
            }

            // Message de bienvenue
            setTimeout(() => {
                if (calculator.historyDisplay) {
                    calculator.historyDisplay.textContent = 'TI-83 Plus v2.0\nPress F1 for help\nCliquez sur Y= pour commencer';
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
            console.log('💡 Cliquez sur les touches ou utilisez Alt+Lettre');

        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            console.error('Stack:', error.stack);
        }
    }, 300);
});
