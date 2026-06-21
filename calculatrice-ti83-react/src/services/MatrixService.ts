/**
 * Service pour les opérations matricielles (MATRX MATH/OPS)
 * Compatible TI-83 Plus
 *
 * Les fonctions acceptent des entrées mathjs (Matrix), tableaux 2D ou vecteurs,
 * et renvoient des `math.Matrix` (pour que le formatage de résultat de
 * l'évaluateur — Calculator.tsx — reconnaisse le type Matrix) ou des scalaires/listes.
 *
 * Convention d'indices : la TI-83 est 1-based pour les opérations sur lignes
 * (rowSwap, *row, *row+, *row-, Matr►list). Conversion en 0-based en interne.
 */

import { create, all } from 'mathjs';

const math = create(all);

const EPS = 1e-10;

/** Extrait un tableau 2D (number[][]) depuis une matrice mathjs, un tableau 2D ou 1D. */
function to2D(m: any): number[][] {
  if (m && typeof m.toArray === 'function') {
    const arr = m.toArray();
    if (Array.isArray(arr) && Array.isArray(arr[0])) {
      return arr.map((row: any) => (row as number[]).map((v: any) => Number(v)));
    }
    if (Array.isArray(arr)) {
      // Vecteur ligne
      return [(arr as number[]).map((v: any) => Number(v))];
    }
  }
  if (Array.isArray(m)) {
    if (m.length > 0 && Array.isArray(m[0])) {
      return (m as number[][]).map((row) => row.map((v) => Number(v)));
    }
    // Vecteur 1D
    return [(m as number[]).map((v) => Number(v))];
  }
  throw new Error('Argument matrice invalide');
}

/** Détecte si l'entrée est un vecteur 1D (liste) vs une matrice 2D. */
function is1D(m: any): boolean {
  if (m && typeof m.size === 'function') {
    const s = m.size();
    return s.size ? s.size() === 1 : (s as any[]).length === 1;
  }
  if (Array.isArray(m)) {
    return !Array.isArray(m[0]);
  }
  return false;
}

export class MatrixService {

  // ==================== MATH ====================

  /** det( — déterminant. */
  static det(m: any): number {
    return math.det(m) as number;
  }

  /** ᵀ — transposée. */
  static transpose(m: any): any {
    return math.transpose(m);
  }

  /** Inverse (pour [A]⁻¹). */
  static inverse(m: any): any {
    return math.inv(m);
  }

  /** identity( — matrice identité n×n. */
  static identity(n: number): any {
    return math.identity(n);
  }

  /** randM( — matrice rows×cols de nombres aléatoires dans [0,1). */
  static randM(rows: number, cols: number): any {
    const data: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < cols; j++) {
        row.push(Math.random());
      }
      data.push(row);
    }
    return math.matrix(data);
  }

  /** augment( — concaténation horizontale (côte à côte) de plusieurs matrices. */
  static augment(...mats: any[]): any {
    if (mats.length === 0) throw new Error('augment: aucun argument');
    const asMatrices = mats.map((m) => (m && typeof m.toArray === 'function') ? m : math.matrix(m));
    return math.concat(...asMatrices, 1);
  }

  /** dim( — dimension unifiée. Liste → longueur ; Matrice → [rows, cols]. */
  static dim(m: any): any {
    if (is1D(m)) {
      const arr = (m && typeof m.toArray === 'function') ? m.toArray() : m;
      return (arr as number[]).length;
    }
    const size = math.size(m) as any;
    const arr: number[] = (size && typeof size.toArray === 'function') ? size.toArray() : size;
    return math.matrix(arr);
  }

  /** cumSum( — sommes cumulées (colonne par colonne pour une matrice ; cumul pour une liste). */
  static cumSum(m: any): any {
    if (is1D(m)) {
      const arr = (m && typeof m.toArray === 'function') ? (m.toArray() as number[]) : (m as number[]);
      const out: number[] = [];
      let acc = 0;
      for (const v of arr) { acc += v; out.push(acc); }
      return math.matrix(out);
    }
    const data = to2D(m);
    const rows = data.length;
    const cols = data[0].length;
    const out: number[][] = data.map((row) => [...row]);
    for (let j = 0; j < cols; j++) {
      let acc = 0;
      for (let i = 0; i < rows; i++) {
        acc += out[i][j];
        out[i][j] = acc;
      }
    }
    return math.matrix(out);
  }

  // ==================== Formes échelonnées ====================

  /**
   * Élimination de Gauss (pivot partiel).
   * @param reduced true → forme échelonnée réduite (rref), false → échelonnée (ref).
   */
  private static gaussian(m: any, reduced: boolean): any {
    const data = to2D(m).map((row) => [...row]);
    const rows = data.length;
    const cols = data[0].length;
    let pivotRow = 0;

    for (let col = 0; col < cols && pivotRow < rows; col++) {
      // Pivot partiel : trouver la plus grande valeur absolue dans la colonne
      let maxRow = pivotRow;
      let maxVal = Math.abs(data[pivotRow][col]);
      for (let r = pivotRow + 1; r < rows; r++) {
        if (Math.abs(data[r][col]) > maxVal) {
          maxVal = Math.abs(data[r][col]);
          maxRow = r;
        }
      }
      if (maxVal < EPS) continue; // colonne de zéros, pas de pivot ici

      // Échanger la ligne pivot avec maxRow
      if (maxRow !== pivotRow) {
        const tmp = data[pivotRow];
        data[pivotRow] = data[maxRow];
        data[maxRow] = tmp;
      }

      // Normaliser la ligne pivot
      const pivotVal = data[pivotRow][col];
      for (let c = 0; c < cols; c++) {
        data[pivotRow][c] /= pivotVal;
      }

      // Éliminer les autres lignes
      for (let r = 0; r < rows; r++) {
        if (r === pivotRow) continue;
        const factor = data[r][col];
        if (Math.abs(factor) < EPS) continue;
        if (!reduced && r < pivotRow) continue; // ref : ne remonter que vers le bas
        for (let c = 0; c < cols; c++) {
          data[r][c] -= factor * data[pivotRow][c];
        }
      }
      pivotRow++;
    }

    // Nettoyage : arrondir les ~0
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (Math.abs(data[i][j]) < EPS) data[i][j] = 0;
      }
    }
    return math.matrix(data);
  }

  /** ref( — forme échelonnée (row echelon form). */
  static ref(m: any): any {
    return MatrixService.gaussian(m, false);
  }

  /** rref( — forme échelonnée réduite (reduced row echelon form). */
  static rref(m: any): any {
    return MatrixService.gaussian(m, true);
  }

  // ==================== Opérations sur lignes (1-based) ====================

  /** rowSwap([A], i, j) — échanger les lignes i et j (1-based). */
  static rowSwap(m: any, i: number, j: number): any {
    const data = to2D(m).map((row) => [...row]);
    const rows = data.length;
    const a = i - 1;
    const b = j - 1;
    if (a < 0 || b < 0 || a >= rows || b >= rows) {
      throw new Error('ERR:INVALID DIM');
    }
    const tmp = data[a];
    data[a] = data[b];
    data[b] = tmp;
    return math.matrix(data);
  }

  /** *row(factor, [A], i) — multiplier la ligne i par factor (1-based). */
  static row(factor: number, m: any, i: number): any {
    const data = to2D(m).map((row) => [...row]);
    const rows = data.length;
    const cols = data[0].length;
    const r = i - 1;
    if (r < 0 || r >= rows) throw new Error('ERR:INVALID DIM');
    for (let c = 0; c < cols; c++) {
      data[r][c] *= factor;
    }
    return math.matrix(data);
  }

  /** *row+(factor, [A], i, j) — ligne j += factor * ligne i (1-based). */
  static rowPlus(factor: number, m: any, i: number, j: number): any {
    const data = to2D(m).map((row) => [...row]);
    const rows = data.length;
    const cols = data[0].length;
    const a = i - 1;
    const b = j - 1;
    if (a < 0 || b < 0 || a >= rows || b >= rows) throw new Error('ERR:INVALID DIM');
    for (let c = 0; c < cols; c++) {
      data[b][c] += factor * data[a][c];
    }
    return math.matrix(data);
  }

  /** *row-(factor, [A], i, j) — ligne j -= factor * ligne i (1-based). */
  static rowMinus(factor: number, m: any, i: number, j: number): any {
    return MatrixService.rowPlus(-factor, m, i, j);
  }

  // ==================== Conversions liste ↔ matrice ====================

  /** Matr►list( — extraire la colonne `col` (1-based, défaut 1) d'une matrice en liste. */
  static matrToList(m: any, col: number = 1): any {
    const data = to2D(m);
    const rows = data.length;
    const cols = data[0].length;
    const c = col - 1;
    if (c < 0 || c >= cols) throw new Error('ERR:INVALID DIM');
    const list: number[] = [];
    for (let r = 0; r < rows; r++) {
      list.push(data[r][c]);
    }
    return math.matrix(list);
  }

  /** List►matr( — assembler plusieurs listes en colonnes d'une matrice. */
  static listToMatr(...lists: any[]): any {
    if (lists.length === 0) throw new Error('List►matr: aucun argument');
    const cols: number[][] = lists.map((l) => {
      if (l && typeof l.toArray === 'function') return (l.toArray() as number[]).map((v) => Number(v));
      if (Array.isArray(l)) return (l as number[]).map((v) => Number(v));
      return [Number(l)];
    });
    const rows = Math.max(...cols.map((c) => c.length));
    const data: number[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: number[] = [];
      for (let c = 0; c < cols.length; c++) {
        row.push(r < cols[c].length ? cols[c][r] : 0);
      }
      data.push(row);
    }
    return math.matrix(data);
  }

  /** Fill(value, [A]) — renvoie une matrice même dimension remplie de `value`.
   *  Fill(value, n) — variante liste : renvoie une liste de longueur n remplie de `value`.
   *  (Variante retournant une valeur — la TI-83 mute en place ; voir limitations README.) */
  static fill(value: number, m: any): any {
    if (typeof m === 'number') {
      return math.matrix(Array(m).fill(value));
    }
    if (is1D(m)) {
      const arr = (m && typeof m.toArray === 'function') ? (m.toArray() as number[]) : (m as number[]);
      return math.matrix(arr.map(() => value));
    }
    const data = to2D(m);
    const filled = data.map((row) => row.map(() => value));
    return math.matrix(filled);
  }

  /** SortA sur une matrice (tri de chaque ligne) ou une liste (tri croissant). */
  static sortA(m: any): any {
    if (is1D(m)) {
      const arr = (m && typeof m.toArray === 'function') ? (m.toArray() as number[]) : (m as number[]);
      return math.matrix([...arr].sort((a, b) => a - b));
    }
    const data = to2D(m).map((row) => [...row].sort((a, b) => a - b));
    return math.matrix(data);
  }

  /** SortD sur une matrice (tri de chaque ligne) ou une liste (tri décroissant). */
  static sortD(m: any): any {
    if (is1D(m)) {
      const arr = (m && typeof m.toArray === 'function') ? (m.toArray() as number[]) : (m as number[]);
      return math.matrix([...arr].sort((a, b) => b - a));
    }
    const data = to2D(m).map((row) => [...row].sort((a, b) => b - a));
    return math.matrix(data);
  }
}