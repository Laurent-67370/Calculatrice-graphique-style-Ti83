/**
 * Handlers pour les fonctions DRAW
 * Compatible TI-83 Plus
 */

export const createDrawHandlers = (
  appendInput: (value: string) => void,
  setCurrentMenu: (menu: string | null) => void
) => ({
  // Fonction principale
  'clr-draw': () => { appendInput('ClrDraw'); setCurrentMenu(null); },
  'line': () => { appendInput('Line('); setCurrentMenu(null); },
  'horizontal': () => { appendInput('Horizontal '); setCurrentMenu(null); },
  'vertical': () => { appendInput('Vertical '); setCurrentMenu(null); },
  'tangent': () => { appendInput('Tangent('); setCurrentMenu(null); },
  'draw-f': () => { appendInput('DrawF '); setCurrentMenu(null); },
  'shade': () => { appendInput('Shade('); setCurrentMenu(null); },
  'draw-inv': () => { appendInput('DrawInv '); setCurrentMenu(null); },
  'circle': () => { appendInput('Circle('); setCurrentMenu(null); },
  'text': () => { appendInput('Text('); setCurrentMenu(null); },

  // Sous-menu POINTS
  'pt-on': () => { appendInput('Pt-On('); setCurrentMenu(null); },
  'pt-off': () => { appendInput('Pt-Off('); setCurrentMenu(null); },
  'pt-change': () => { appendInput('Pt-Change('); setCurrentMenu(null); },

  // Sous-menu STO
  'store-pic': () => { appendInput('StorePic '); setCurrentMenu(null); },
  'recall-pic': () => { appendInput('RecallPic '); setCurrentMenu(null); },
  'store-gdb': () => { appendInput('StoreGDB '); setCurrentMenu(null); },
  'recall-gdb': () => { appendInput('RecallGDB '); setCurrentMenu(null); },
});
