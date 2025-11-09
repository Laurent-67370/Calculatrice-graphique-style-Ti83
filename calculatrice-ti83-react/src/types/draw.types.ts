/**
 * Types pour les outils de dessin (DRAW)
 * Compatible TI-83 Plus
 */

// Type de base pour tous les éléments dessinés
export type DrawElement =
  | DrawLine
  | DrawHorizontal
  | DrawVertical
  | DrawCircle
  | DrawText
  | DrawFunction
  | DrawShade
  | DrawPoint
  | DrawTangent
  | DrawInverse;

// Line - Tracer une ligne entre deux points
export interface DrawLine {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// Horizontal - Ligne horizontale
export interface DrawHorizontal {
  type: 'horizontal';
  y: number; // Valeur Y de la ligne horizontale
}

// Vertical - Ligne verticale
export interface DrawVertical {
  type: 'vertical';
  x: number; // Valeur X de la ligne verticale
}

// Circle - Dessiner un cercle
export interface DrawCircle {
  type: 'circle';
  x: number; // Centre X
  y: number; // Centre Y
  r: number; // Rayon
}

// Text - Afficher du texte sur le graphique
export interface DrawText {
  type: 'text';
  x: number;
  y: number;
  text: string;
}

// DrawF - Dessiner une fonction
export interface DrawFunction {
  type: 'function';
  expr: string; // Expression de la fonction
}

// Shade - Ombrage entre deux courbes
export interface DrawShade {
  type: 'shade';
  f1: string; // Première fonction
  f2: string; // Deuxième fonction
  xMin: number;
  xMax: number;
}

// Point - Activer/désactiver un point
export interface DrawPoint {
  type: 'point';
  x: number;
  y: number;
  on: boolean; // true = point visible, false = point caché
}

// État des dessins
export interface DrawState {
  elements: DrawElement[];
  pictures: { [key: string]: DrawElement[] }; // Pic1-Pic10
}

// Tangent - Dessiner la tangente à une fonction en un point
export interface DrawTangent {
  type: 'tangent';
  expr: string; // Expression de la fonction
  x: number;    // Point de tangence
}

// DrawInv - Dessiner l'inverse d'une fonction (symétrie par rapport à y=x)
export interface DrawInverse {
  type: 'inverse';
  expr: string; // Expression de la fonction
}
