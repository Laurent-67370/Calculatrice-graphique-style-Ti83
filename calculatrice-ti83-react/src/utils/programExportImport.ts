/**
 * Service d'export/import de programmes TI-BASIC
 * Supporte les formats .8xp (TI-83 Plus), .83p (TI-83) et JSON
 */

// Type pour les programmes lors de l'export/import
// (différent du type store qui a un tableau de lignes)
export interface Program {
  name: string;
  code: string;  // Code du programme en format texte (lignes jointes par \n)
}

// Constantes pour le format .8xp TI-83 Plus
const TI83_SIGNATURE = '**TI83**';
const TI83_FURTHER_SECTION = [0x1A, 0x0A, 0x00];
const PROGRAM_TYPE_ID = 0x05; // Type ID pour programme

// Constantes pour le format .83p TI-83 (originale)
const TI83_ORIGINAL_SIGNATURE = '**TI83F*';
const TI83_ORIGINAL_FURTHER_SECTION = [0x1A, 0x0A, 0x00];

/**
 * Exporte un programme au format JSON
 */
export function exportProgramAsJSON(program: Program): Blob {
  const data = {
    version: '3.1.0',
    type: 'ti83-program',
    program: {
      name: program.name,
      code: program.code,
      createdAt: new Date().toISOString(),
      calculator: 'TI-83 Plus',
    },
  };

  const json = JSON.stringify(data, null, 2);
  return new Blob([json], { type: 'application/json' });
}

/**
 * Exporte tous les programmes au format JSON
 */
export function exportAllProgramsAsJSON(programs: Program[]): Blob {
  const data = {
    version: '3.1.0',
    type: 'ti83-programs-collection',
    programs: programs.map(p => ({
      name: p.name,
      code: p.code,
    })),
    exportedAt: new Date().toISOString(),
    calculator: 'TI-83 Plus',
  };

  const json = JSON.stringify(data, null, 2);
  return new Blob([json], { type: 'application/json' });
}

/**
 * Importe un programme depuis JSON
 */
export function importProgramFromJSON(jsonContent: string): Program | Program[] | null {
  try {
    const data = JSON.parse(jsonContent);

    // Vérifier le type
    if (data.type === 'ti83-program' && data.program) {
      // Import d'un seul programme
      return {
        name: data.program.name || 'IMPORT',
        code: data.program.code || '',
      };
    } else if (data.type === 'ti83-programs-collection' && Array.isArray(data.programs)) {
      // Import de plusieurs programmes
      return data.programs.map((p: any) => ({
        name: p.name || 'IMPORT',
        code: p.code || '',
      }));
    }

    // Format ancien ou non reconnu
    if (data.name && data.code) {
      return {
        name: data.name,
        code: data.code,
      };
    }

    return null;
  } catch (error) {
    console.error('Erreur import JSON:', error);
    return null;
  }
}

/**
 * Convertit une chaîne en bytes pour le format .8xp
 */
function stringToBytes(str: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}

/**
 * Calcule le checksum pour le format .8xp
 */
function calculateChecksum(data: number[]): number {
  let sum = 0;
  for (const byte of data) {
    sum += byte;
  }
  return sum & 0xFFFF; // 16 bits
}

/**
 * Convertit un token TI-BASIC en byte(s)
 * Simplifié : mappe les commandes communes
 */
function tokenizeTIBasic(code: string): number[] {
  const bytes: number[] = [];
  const lines = code.split('\n');

  // Mapping simplifié des tokens TI-83
  const tokenMap: Record<string, number[]> = {
    'Disp': [0xDE],
    'Input': [0xDC],
    'Prompt': [0xDD],
    'Output': [0xE1, 0xE2],
    'ClrHome': [0xE5, 0x58],
    'If': [0xCE],
    'Then': [0xCF],
    'Else': [0xD0],
    'End': [0xD1],
    'For': [0xD2],
    'While': [0xD3],
    'Repeat': [0xD4],
    'Lbl': [0xD7],
    'Goto': [0xD8],
    'Pause': [0xD9],
    'Stop': [0xDA],
    'Return': [0xDB],
    'Menu': [0xE1, 0xE1],
    'DelVar': [0xE1, 0xE3],
    'getKey': [0xE1, 0xB0],
    '→': [0x04], // STO
    '=': [0x3D],
    '+': [0x2B],
    '-': [0x2D],
    '*': [0x2A],
    '/': [0x2F],
    '^': [0x5E],
    '(': [0x28],
    ')': [0x29],
    ',': [0x2C],
    ':': [0x3E], // Séparateur de ligne
    '"': [0x22],
  };

  for (const line of lines) {
    let i = 0;
    while (i < line.length) {
      let matched = false;

      // Essayer de matcher des tokens multi-caractères
      for (const [token, tokenBytes] of Object.entries(tokenMap)) {
        if (line.substring(i).startsWith(token)) {
          bytes.push(...tokenBytes);
          i += token.length;
          matched = true;
          break;
        }
      }

      if (!matched) {
        // Caractère simple
        const char = line[i];
        if (char >= 'A' && char <= 'Z') {
          bytes.push(0x41 + (char.charCodeAt(0) - 'A'.charCodeAt(0)));
        } else if (char >= '0' && char <= '9') {
          bytes.push(0x30 + (char.charCodeAt(0) - '0'.charCodeAt(0)));
        } else if (char === ' ') {
          bytes.push(0x20);
        } else {
          bytes.push(char.charCodeAt(0));
        }
        i++;
      }
    }

    // Ajouter séparateur de ligne
    bytes.push(0x3F); // Newline token
  }

  return bytes;
}

/**
 * Exporte un programme au format .8xp (TI-83 Plus)
 */
export function exportProgramAs8xp(program: Program): Blob {
  const bytes: number[] = [];

  // Header: Signature "**TI83**"
  bytes.push(...stringToBytes(TI83_SIGNATURE));

  // Further section
  bytes.push(...TI83_FURTHER_SECTION);

  // Comment (42 bytes, padded with 0)
  const comment = `Created by TI-83 Plus Web v3.1.0`;
  const commentBytes = stringToBytes(comment);
  bytes.push(...commentBytes);
  for (let i = commentBytes.length; i < 42; i++) {
    bytes.push(0x00);
  }

  // Data section length (placeholder, we'll fill it later)
  const dataSectionStartIndex = bytes.length;
  bytes.push(0x00, 0x00); // Placeholder

  // Variable entry
  const variableEntry: number[] = [];

  // Header offset (always 11 for programs)
  variableEntry.push(0x0B, 0x00);

  // Data length (placeholder)
  const dataLengthIndex = variableEntry.length;
  variableEntry.push(0x00, 0x00);

  // Type ID (0x05 for program)
  variableEntry.push(PROGRAM_TYPE_ID);

  // Variable name (8 bytes, padded with 0)
  const progName = program.name.toUpperCase().substring(0, 8);
  const nameBytes = stringToBytes(progName);
  variableEntry.push(...nameBytes);
  for (let i = nameBytes.length; i < 8; i++) {
    variableEntry.push(0x00);
  }

  // Version (0x00)
  variableEntry.push(0x00);

  // Archived flag (0x00 = not archived)
  variableEntry.push(0x00);

  // Data length (same as above, placeholder)
  variableEntry.push(0x00, 0x00);

  // Tokenized program data
  const programData = tokenizeTIBasic(program.code);

  // Length of program data (2 bytes, little-endian)
  const progLength = programData.length;
  variableEntry[dataLengthIndex] = progLength & 0xFF;
  variableEntry[dataLengthIndex + 1] = (progLength >> 8) & 0xFF;
  variableEntry[variableEntry.length - 2] = progLength & 0xFF;
  variableEntry[variableEntry.length - 1] = (progLength >> 8) & 0xFF;

  // Add variable entry to bytes
  bytes.push(...variableEntry);

  // Add program data
  bytes.push(...programData);

  // Fill in data section length
  const dataLength = bytes.length - dataSectionStartIndex - 2;
  bytes[dataSectionStartIndex] = dataLength & 0xFF;
  bytes[dataSectionStartIndex + 1] = (dataLength >> 8) & 0xFF;

  // Checksum (sum of data section)
  const checksumData = bytes.slice(dataSectionStartIndex + 2);
  const checksum = calculateChecksum(checksumData);
  bytes.push(checksum & 0xFF);
  bytes.push((checksum >> 8) & 0xFF);

  return new Blob([new Uint8Array(bytes)], { type: 'application/octet-stream' });
}

/**
 * Télécharge un fichier
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Lecture d'un fichier
 */
export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/**
 * Détecte le format d'un fichier importé
 */
export function detectFileFormat(filename: string, content: string): 'json' | '8xp' | '83p' | 'unknown' {
  const ext = filename.toLowerCase().split('.').pop();

  if (ext === 'json') {
    return 'json';
  }

  if (ext === '8xp') {
    return '8xp';
  }

  if (ext === '83p') {
    return '83p';
  }

  // Essayer de parser comme JSON
  try {
    JSON.parse(content);
    return 'json';
  } catch {
    return 'unknown';
  }
}

/**
 * Import simplifié depuis .8xp
 * Note: Le parsing complet de .8xp est complexe, cette version est simplifiée
 */
export function importProgramFrom8xp(content: ArrayBuffer): Program | null {
  try {
    const bytes = new Uint8Array(content);

    // Vérifier la signature
    const signature = String.fromCharCode(...bytes.slice(0, 8));
    if (signature !== TI83_SIGNATURE) {
      console.error('Signature invalide:', signature);
      return null;
    }

    // Extraire le nom du programme (commence à l'offset ~60)
    let nameStart = 60;
    const nameBytes = bytes.slice(nameStart, nameStart + 8);
    const name = String.fromCharCode(...nameBytes).replace(/\0/g, '').trim();

    // Note: Le décodage complet du programme tokenisé nécessiterait
    // un mapping inverse complet de tous les tokens TI-83
    // Pour l'instant, retourner un placeholder
    return {
      name: name || 'IMPORT',
      code: ':Disp "Programme importé depuis .8xp"\n:Disp "Éditer manuellement"',
    };
  } catch (error) {
    console.error('Erreur import .8xp:', error);
    return null;
  }
}

/**
 * Import simplifié depuis .83p (TI-83 originale)
 * Note: Le parsing complet de .83p est complexe, cette version est simplifiée
 */
export function importProgramFrom83p(content: ArrayBuffer): Program | null {
  try {
    const bytes = new Uint8Array(content);

    // Vérifier la signature TI-83 originale
    const signature = String.fromCharCode(...bytes.slice(0, 8));
    if (signature !== TI83_ORIGINAL_SIGNATURE) {
      console.error('Signature invalide pour .83p:', signature);
      return null;
    }

    // Extraire le nom du programme (commence à l'offset ~60)
    let nameStart = 60;
    const nameBytes = bytes.slice(nameStart, nameStart + 8);
    const name = String.fromCharCode(...nameBytes).replace(/\0/g, '').trim();

    // Note: Le décodage complet du programme tokenisé nécessiterait
    // un mapping inverse complet de tous les tokens TI-83
    // Pour l'instant, retourner un placeholder
    return {
      name: name || 'IMPORT',
      code: ':Disp "Programme importé depuis .83p"\n:Disp "Éditer manuellement"',
    };
  } catch (error) {
    console.error('Erreur import .83p:', error);
    return null;
  }
}

/**
 * Génère un nom de fichier pour l'export
 */
export function generateExportFilename(programName: string, format: 'json' | '8xp'): string {
  const safeName = programName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
  const timestamp = new Date().toISOString().slice(0, 10);
  return `${safeName}_${timestamp}.${format}`;
}
