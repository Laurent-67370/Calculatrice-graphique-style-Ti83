/**
 * Handlers pour les fonctions DRAW
 * Compatible TI-83 Plus
 */

export const drawHandlers = {
  // Fonction principale
  'clr-draw': () => 'ClrDraw',
  'line': () => 'Line(',
  'horizontal': () => 'Horizontal ',
  'vertical': () => 'Vertical ',
  'tangent': () => 'Tangent(',
  'draw-f': () => 'DrawF ',
  'shade': () => 'Shade(',
  'draw-inv': () => 'DrawInv ',
  'circle': () => 'Circle(',
  'text': () => 'Text(',

  // Sous-menu POINTS
  'pt-on': () => 'Pt-On(',
  'pt-off': () => 'Pt-Off(',
  'pt-change': () => 'Pt-Change(',

  // Sous-menu STO
  'store-pic': () => 'StorePic ',
  'recall-pic': () => 'RecallPic ',
  'store-gdb': () => 'StoreGDB ',
  'recall-gdb': () => 'RecallGDB ',
};
