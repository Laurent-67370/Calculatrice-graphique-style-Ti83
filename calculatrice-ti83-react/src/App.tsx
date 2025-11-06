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
      </header>

      <main className="app-main">
        <Calculator />
      </main>
    </div>
  );
}

export default App;
