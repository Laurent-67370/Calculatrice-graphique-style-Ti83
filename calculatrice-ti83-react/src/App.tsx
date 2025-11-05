/**
 * Application principale
 */

import { Calculator } from './components/Calculator/Calculator';
import './styles/ti83.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Calculatrice Graphique TI-83 Plus</h1>
        <p>Version React + TypeScript - Optimisée et Robuste</p>
      </header>

      <main className="app-main">
        <Calculator />
      </main>

      <footer className="app-footer">
        <div className="instructions">
          <h3>Instructions</h3>
          <ul>
            <li><strong>Y=</strong> : Définir des fonctions (ex: Y1=X^2)</li>
            <li><strong>GRAPH</strong> : Afficher le graphique</li>
            <li><strong>WINDOW</strong> : Régler la fenêtre de visualisation</li>
            <li><strong>ZOOM</strong> : Options de zoom</li>
            <li><strong>Clavier</strong> : Utilisez les touches numériques et opérateurs</li>
          </ul>
        </div>

        <div className="features">
          <h3>Améliorations TypeScript + React</h3>
          <ul>
            <li>✅ Typage statique complet</li>
            <li>✅ Gestion d'état optimisée avec Zustand</li>
            <li>✅ Composants React modulaires</li>
            <li>✅ Performance améliorée avec React.memo</li>
            <li>✅ Architecture maintenable et testable</li>
            <li>✅ Build optimisé avec Vite</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;
