/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShiftType, UVWRotation } from './types';

export function getDiasDeFebrero(año: number): number {
  let añoInicialDeReferencia = 2008;
  while (año !== añoInicialDeReferencia && año > añoInicialDeReferencia) {
    añoInicialDeReferencia += 4;
  }
  return año === añoInicialDeReferencia ? 29 : 28;
}

export function getCantDiasDeEsteMes(mes: string, año: number): number {
  switch (mes) {
    case 'ENE':
    case 'MAR':
    case 'MAY':
    case 'JUL':
    case 'AGO':
    case 'OCT':
    case 'DIC':
      return 31;
    case 'ABR':
    case 'JUN':
    case 'SEP':
    case 'NOV':
      return 30;
    case 'FEB':
      return getDiasDeFebrero(año);
    default:
      return 30;
  }
}

export function mexEnNumeros(letras: string): number {
  switch (letras) {
    case 'ENE': return 1;
    case 'FEB': return 2;
    case 'MAR': return 3;
    case 'ABR': return 4;
    case 'MAY': return 5;
    case 'JUN': return 6;
    case 'JUL': return 7;
    case 'AGO': return 8;
    case 'SEP': return 9;
    case 'OCT': return 10;
    case 'NOV': return 11;
    case 'DIC': return 12;
    default: return 1;
  }
}

export function nombreMes(numero: number): string {
  switch (numero) {
    case 1: return 'ENE';
    case 2: return 'FEB';
    case 3: return 'MAR';
    case 4: return 'ABR';
    case 5: return 'MAY';
    case 6: return 'JUN';
    case 7: return 'JUL';
    case 8: return 'AGO';
    case 9: return 'SEP';
    case 10: return 'OCT';
    case 11: return 'NOV';
    case 12: return 'DIC';
    default: return 'ENE';
  }
}

export function getTurno(grupoName: string): number {
  // Trim spaces from group name
  const grupo = grupoName.replace('Grupo', '').trim();
  switch (grupo) {
    case 'A': return 0;
    case 'B': return 28;
    case 'C': return 14;
    case 'D': return 42;

    case 'E': return 0;
    case 'F': return 28;

    case 'N': return 14;
    case 'O': return 28;

    case 'P': return 14;
    case 'Q': return 0;

    case 'U': return 0;
    case 'V': return 14;
    case 'W': return 7;

    case 'X': return 7;
    case 'Y': return 0;
    case 'Z': return 14;
    default: return 0;
  }
}

export function getPeriodo(grupoName: string): number {
  const grupo = grupoName.replace('Grupo', '').trim();
  switch (grupo) {
    case 'A':
    case 'B':
    case 'C':
    case 'D':
      return 56;
    case 'E':
    case 'F':
      return 56;
    case 'N':
    case 'O':
      return 28;
    case 'P':
    case 'Q':
      return 28;
    case 'U':
    case 'V':
    case 'W':
      return 21;
    case 'X':
    case 'Y':
    case 'Z':
      return 21;
    default:
      return 56;
  }
}

export function getPrimerDienteDeEsteMes(mes: string, año: number, grupoName: string): number {
  const grupo = grupoName.replace('Grupo', '').trim();
  let sumaDeDias = 0;
  let diass = 0;
  const vueltas = año - 2015 + 1;
  let añoActual = 2015;

  for (let x = 1; x <= vueltas; x++) {
    if (mes !== 'ENE' || x < vueltas) {
      sumaDeDias += 31;
    } else {
      diass = sumaDeDias;
    }

    const febDays = getDiasDeFebrero(añoActual);
    if (mes !== 'FEB' || x < vueltas) {
      sumaDeDias += febDays;
    } else {
      diass = sumaDeDias;
    }

    if (mes !== 'MAR' || x < vueltas) {
      sumaDeDias += 31;
    } else {
      diass = sumaDeDias;
    }

    if (mes !== 'ABR' || x < vueltas) {
      sumaDeDias += 30;
    } else {
      diass = sumaDeDias;
    }

    if (mes !== 'MAY' || x < vueltas) {
      sumaDeDias += 31;
    } else {
      diass = sumaDeDias;
    }

    if (mes !== 'JUN' || x < vueltas) {
      sumaDeDias += 30;
    } else {
      diass = sumaDeDias;
    }

    if (mes !== 'JUL' || x < vueltas) {
      sumaDeDias += 31;
    } else {
      diass = sumaDeDias;
    }

    if (mes !== 'AGO' || x < vueltas) {
      sumaDeDias += 31;
    } else {
      diass = sumaDeDias;
    }

    if (mes !== 'SEP' || x < vueltas) {
      sumaDeDias += 30;
    } else {
      diass = sumaDeDias;
    }

    if (mes !== 'OCT' || x < vueltas) {
      sumaDeDias += 31;
    } else {
      diass = sumaDeDias;
    }

    if (mes !== 'NOV' || x < vueltas) {
      sumaDeDias += 30;
    } else {
      diass = sumaDeDias;
    }

    if (mes !== 'DIC' || x < vueltas) {
      sumaDeDias += 31;
    } else {
      diass = sumaDeDias;
    }

    añoActual += 1;
  }

  const limit = getPeriodo(grupo);
  let currentDiass = diass;
  while (currentDiass > limit) {
    currentDiass -= limit;
  }

  return currentDiass + 4 + getTurno(grupo);
}

export function getColorrABCD(indice: number): ShiftType {
  switch (indice) {
    case 1: case 2: case 3: case 4: case 8: case 9: case 10: case 11:
    case 32: case 33: case 34: case 35: case 39: case 40: case 41: case 42:
      return 'D';
    case 15: case 16: case 20: case 21: case 22: case 23: case 27: case 28:
    case 45: case 46: case 47: case 52: case 53: case 54:
      return 'N';
    case 5: case 6: case 7: case 12: case 13: case 14: case 17: case 18: case 19:
    case 24: case 25: case 26: case 29: case 30: case 31: case 36: case 37: case 38:
    case 43: case 44: case 48: case 49: case 50: case 51: case 55: case 56:
      return 'F';
    default:
      return 'F';
  }
}

export function getColorrEF(indice: number): ShiftType {
  switch (indice) {
    case 1: case 2: case 3: case 4: case 8: case 9: case 10: case 11:
    case 15: case 16: case 20: case 21: case 22: case 23: case 27: case 28:
    case 32: case 33: case 34: case 35: case 39: case 40: case 41: case 42:
    case 45: case 46: case 47: case 52: case 53: case 54:
      return 'D';
    case 5: case 6: case 7: case 12: case 13: case 14: case 17: case 18: case 19:
    case 24: case 25: case 26: case 29: case 30: case 31: case 36: case 37: case 38:
    case 43: case 44: case 48: case 49: case 50: case 51: case 55: case 56:
      return 'F';
    default:
      return 'F';
  }
}

export function getColorrNO(indice: number): ShiftType {
  switch (indice) {
    case 1: case 2: case 3: case 4: case 8: case 9: case 10: case 11:
      return 'D';
    case 15: case 16: case 17: case 18: case 22: case 23: case 24:
      return 'N';
    case 5: case 6: case 7: case 12: case 13: case 14: case 19: case 20: case 21:
    case 25: case 26: case 27: case 28:
      return 'F';
    default:
      return 'F';
  }
}

export function getColorrPQ(indice: number): ShiftType {
  switch (indice) {
    case 2: case 3: case 4: case 5: case 9: case 10: case 11: case 12:
      return 'D';
    case 16: case 17: case 18: case 19: case 23: case 24: case 25:
      return 'N';
    case 1: case 6: case 7: case 8: case 13: case 14: case 15:
    case 20: case 21: case 22: case 26: case 27: case 28:
      return 'F';
    default:
      return 'F';
  }
}

export function getColorrUVW(indice: number, uvwRotation: UVWRotation): ShiftType {
  if (uvwRotation === 'normal') {
    switch (indice) {
      case 1: case 2: case 3: case 4: case 19: case 20:
        return 'D';
      case 9: case 10: case 11: case 12: case 15:
        return 'N';
      case 5: case 6: case 7: case 8: case 13: case 14: case 16: case 17: case 18: case 21:
        return 'F';
      default:
        return 'F';
    }
  } else {
    switch (indice) {
      case 1: case 2: case 3: case 4: case 18: case 19:
        return 'D';
      case 9: case 10: case 11: case 12: case 15:
        return 'N';
      case 5: case 6: case 7: case 8: case 13: case 14: case 16: case 17: case 20: case 21:
        return 'F';
      default:
        return 'F';
    }
  }
}

export function getColorrXYZ(indice: number): ShiftType {
  switch (indice) {
    case 1: case 2: case 3: case 4: case 11: case 12: case 13:
      return 'D';
    case 15: case 16: case 17: case 18:
      return 'N';
    case 5: case 6: case 7: case 8: case 9: case 10: case 14: case 19: case 20: case 21:
      return 'F';
    default:
      return 'F';
  }
}

export function getShiftForDayGroup(
  dia: number,
  mes: string,
  año: number,
  grupoName: string,
  uvwRotation: UVWRotation
): ShiftType {
  const grupo = grupoName.replace('Grupo', '').trim();
  const duracionPeriodo = getPeriodo(grupo);
  let diente = getPrimerDienteDeEsteMes(mes, año, grupo) + dia - 1;

  while (diente > duracionPeriodo) {
    diente -= duracionPeriodo;
  }

  if (grupo === 'A' || grupo === 'B' || grupo === 'C' || grupo === 'D') {
    return getColorrABCD(diente);
  }
  if (grupo === 'E' || grupo === 'F') {
    return getColorrEF(diente);
  }
  if (grupo === 'N' || grupo === 'O') {
    return getColorrNO(diente);
  }
  if (grupo === 'P' || grupo === 'Q') {
    return getColorrPQ(diente);
  }
  if (grupo === 'U' || grupo === 'V' || grupo === 'W') {
    return getColorrUVW(diente, uvwRotation);
  }
  if (grupo === 'X' || grupo === 'Y' || grupo === 'Z') {
    return getColorrXYZ(diente);
  }
  return 'NADA';
}

export function getPrimerDiaOffset(mes: string, año: number): number {
  const indMes = mexEnNumeros(mes);
  
  // standard js Weekday of 1st day of the month
  // Sunday=0, Monday=1, ..., Saturday=6
  const startDayJS = new Date(año, indMes - 1, 1).getDay();
  
  // In the application, weeks start on Monday (index 0) and end on Sunday (index 6)
  // Let's compute offset:
  // If startDayJS is Sunday (0), offset is 6
  // If startDayJS is Monday (1), offset is 0
  // If startDayJS is Wednesday (3), offset is 2
  const offset = startDayJS === 0 ? 6 : startDayJS - 1;
  return offset;
}
