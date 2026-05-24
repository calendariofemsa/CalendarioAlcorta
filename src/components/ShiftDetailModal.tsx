/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Calendar, Sun, Moon, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UVWRotation, ShiftType } from '../types';
import { getShiftForDayGroup } from '../logic';

interface ShiftDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: number | null;
  month: string;
  year: number;
  uvwRotation: UVWRotation;
}

export default function ShiftDetailModal({
  isOpen,
  onClose,
  day,
  month,
  year,
  uvwRotation,
}: ShiftDetailModalProps) {
  if (day === null) return null;

  const grupos = [
    { name: 'Grupo A', type: 'ABCD' },
    { name: 'Grupo B', type: 'ABCD' },
    { name: 'Grupo C', type: 'ABCD' },
    { name: 'Grupo D', type: 'ABCD' },
    { name: 'Grupo E', type: 'EF' },
    { name: 'Grupo F', type: 'EF' },
    { name: 'Grupo N', type: 'NO' },
    { name: 'Grupo O', type: 'NO' },
    { name: 'Grupo P', type: 'PQ' },
    { name: 'Grupo Q', type: 'PQ' },
    { name: 'Grupo U', type: 'UVW' },
    { name: 'Grupo V', type: 'UVW' },
    { name: 'Grupo W', type: 'UVW' },
    { name: 'Grupo X', type: 'XYZ' },
    { name: 'Grupo Y', type: 'XYZ' },
    { name: 'Grupo Z', type: 'XYZ' },
  ];

  const getShiftLabelAndColors = (shift: ShiftType) => {
    switch (shift) {
      case 'D':
        return {
          label: 'Mañana',
          bg: 'bg-linear-to-br from-yellow-100 to-yellow-300 text-yellow-900 border-yellow-400',
          dot: 'bg-yellow-500',
          icon: <Sun className="w-4 h-4 text-yellow-600 shrink-0" />,
        };
      case 'N':
        return {
          label: 'Noche',
          bg: 'bg-linear-to-br from-[#fd4ecc] to-[#b60c9e] text-white border-pink-500',
          dot: 'bg-white',
          icon: <Moon className="w-4 h-4 text-white shrink-0" />,
        };
      case 'F':
        return {
          label: 'Franco',
          bg: 'bg-linear-to-br from-[#66ff66] to-[#336600] text-white border-green-700',
          dot: 'bg-white',
          icon: <Award className="w-4 h-4 text-white shrink-0" />, // Wait, Award icon in lucide is fine but let's make it a general check/shield or custom icon
        };
      default:
        return {
          label: 'Inactivo',
          bg: 'bg-linear-to-br from-gray-300 to-gray-400 text-gray-800 border-gray-400',
          dot: 'bg-gray-600',
          icon: null,
        };
    }
  };

  // Safe fallback Award function mapping
  function Award({ className }: { className?: string }) {
    return (
      <svg
        className={className}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M6.267 3.455a.75.75 0 00-.708.523L4.547 7.01H1.75a.75.75 0 00-.75.75v1.27c0 .91.547 1.721 1.39 2.062l5.076 2.052a2.25 2.25 0 011.385 1.385l2.053 5.076a2.25 2.25 0 002.062 1.39h1.27a.75.75 0 00.75-.75v-2.797l3.032-1.011a.75.75 0 00.523-.708V11.25a2.25 2.25 0 00-1.385-2.053l-5.076-2.052a2.25 2.25 0 01-1.385-1.385l-2.053-5.076z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  const mapMesANumero = (m: string): number => {
    switch (m) {
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
  };

  const getMesFullString = (m: string): string => {
    switch (m) {
      case 'ENE': return 'Enero';
      case 'FEB': return 'Febrero';
      case 'MAR': return 'Marzo';
      case 'ABR': return 'Abril';
      case 'MAY': return 'Mayo';
      case 'JUN': return 'Junio';
      case 'JUL': return 'Julio';
      case 'AGO': return 'Agosto';
      case 'SEP': return 'Septiembre';
      case 'OCT': return 'Octubre';
      case 'NOV': return 'Noviembre';
      case 'DIC': return 'Diciembre';
      default: return m;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden max-h-[85vh]"
          >
            {/* Header */}
            <div className="relative p-5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-gray-900 text-base" id="detail-modal-title">
                  Situación de Turnos: {day} / {mapMesANumero(month)} / {year}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 px-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Cerrar"
                id="close-detail-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content info description */}
            <div className="p-4 bg-gray-50 text-xs text-gray-500 border-b border-gray-100 text-center uppercase tracking-wide font-medium">
              Turnos calculados para el día {day} de {getMesFullString(month)} de {year}
            </div>

            {/* Grid of group shifts */}
            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 gap-3 md:gap-4">
              {grupos.map((g) => {
                const shift = getShiftForDayGroup(day, month, year, g.name, uvwRotation);
                const styling = getShiftLabelAndColors(shift);

                return (
                  <div
                    key={g.name}
                    className="flex flex-col sm:flex-row items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-all gap-2"
                  >
                    <div className="flex flex-col text-center sm:text-left">
                      <span className="font-semibold text-gray-800 text-sm">
                        {g.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono tracking-wider">
                        ROT: {g.type}
                      </span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border-b text-xs font-semibold shadow-xs shrink-0 w-24 justify-center ${styling.bg}`}
                    >
                      {styling.icon}
                      <span>{styling.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all cursor-pointer"
                id="close-detail-footer-btn"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
