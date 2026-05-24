/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ShiftType = 'D' | 'N' | 'F' | 'NADA';

export interface GroupConfig {
  name: string;
  turno: number;
  periodo: number;
}

export type UVWRotation = 'normal' | 'changed';

