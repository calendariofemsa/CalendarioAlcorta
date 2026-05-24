/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Info,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Award,
  Settings2,
  CalendarDays,
  Sparkles,
} from 'lucide-react';

import { ShiftType, UVWRotation } from './types';
import {
  getCantDiasDeEsteMes,
  getPrimerDiaOffset,
  getPrimerDienteDeEsteMes,
  getPeriodo,
  getColorrABCD,
  getColorrEF,
  getColorrNO,
  getColorrPQ,
  getColorrUVW,
  getColorrXYZ,
  nombreMes,
  mexEnNumeros,
} from './logic';

import AboutModal from './components/AboutModal';
import ShiftDetailModal from './components/ShiftDetailModal';
import cocaColaCap from './assets/images/coca_cola_cap_1779276641029.png';

export default function App() {
  // Splash screen states
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  // Modal states
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [detailDay, setDetailDay] = useState<number | null>(null);

  // Secret trigger for UVW rotation panel (3 taps on FRANCO button)
  const [francoClickCount, setFrancoClickCount] = useState(0);
  const [lastFrancoClickTime, setLastFrancoClickTime] = useState(0);
  const [showUvwConfig, setShowUvwConfig] = useState(false);

  const handleFrancoClick = () => {
    // Reset calendar to current actual month and year
    setSelectedMonth(nombreMes(realCurrentMonthIdx + 1));
    setSelectedYear(realCurrentYear);

    const now = Date.now();
    if (now - lastFrancoClickTime > 2000) {
      setFrancoClickCount(1);
      setLastFrancoClickTime(now);
    } else {
      const nextCount = francoClickCount + 1;
      if (nextCount >= 3) {
        setShowUvwConfig(prev => !prev);
        setFrancoClickCount(0);
        setLastFrancoClickTime(0);
      } else {
        setFrancoClickCount(nextCount);
        setLastFrancoClickTime(now);
      }
    }
  };

  // Load state from localStorage or default
  const [selectedGroup, setSelectedGroup] = useState<string>(() => {
    const saved = localStorage.getItem('CalendarioFemsa');
    // B4A saved index mapping to array
    const groups = [
      '   A', '   B', '   C', '   D',
      '   E', '   F',
      '   N', '   O',
      '   P', '   Q',
      '   U', '   V', '   W',
      '   X', '   Y', '   Z',
    ];
    if (saved !== null) {
      // 1. Check if it is stored as the exact group string with padding
      if (groups.includes(saved)) {
        return saved;
      }
      // 2. Check if it is stored as an unpadded/trimmed group string
      const trimmedSaved = `   ${saved.trim()}`;
      if (groups.includes(trimmedSaved)) {
        return trimmedSaved;
      }
      // 3. Check if stored as the regular numeric index (B4A compatible)
      const idx = parseInt(saved, 10);
      if (!isNaN(idx) && idx >= 0 && idx < groups.length) {
        return groups[idx];
      }
    }
    return '   A'; // Default Group A
  });

  const [uvwRotation, setUvwRotation] = useState<UVWRotation>(() => {
    const saved = localStorage.getItem('Check');
    return saved === 'false' ? 'changed' : 'normal'; // default normal (true in B4A)
  });

  // Current real-life time constants (e.g. May 2026 or current sys date)
  const systemDate = new Date();
  const realCurrentMonthIdx = systemDate.getMonth(); // 0-11
  const realCurrentYear = systemDate.getFullYear();
  const realCurrentDay = systemDate.getDate();

  // Selected date states
  const [selectedMonth, setSelectedMonth] = useState<string>(
    nombreMes(realCurrentMonthIdx + 1)
  );
  const [selectedYear, setSelectedYear] = useState<number>(realCurrentYear);

  // Splash animation triggers
  useEffect(() => {
    // 1. Scale animation completes in 3.5s and holds.
    // 2. At 5.0s, we trigger the fadeSplash to start the fade out.
    const scaleTimer = setTimeout(() => {
      setFadeSplash(true);
    }, 5000);

    // 3. At 6.2s, we completely hide the splash screen.
    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 6200);

    return () => {
      clearTimeout(scaleTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Sync group preference with localStorage
  const handleGroupChange = (grp: string) => {
    setSelectedGroup(grp);
    const groups = [
      '   A', '   B', '   C', '   D',
      '   E', '   F',
      '   N', '   O',
      '   P', '   Q',
      '   U', '   V', '   W',
      '   X', '   Y', '   Z',
    ];
    const idx = groups.indexOf(grp);
    if (idx !== -1) {
      localStorage.setItem('CalendarioFemsa', idx.toString());
    }
  };

  // Sync UVW rotation state with localStorage
  const handleUvwRotationChange = (rot: UVWRotation) => {
    setUvwRotation(rot);
    localStorage.setItem('Check', rot === 'normal' ? 'true' : 'false');
  };

  // Previous and next month handlers matching B4A wraps
  const handlePrevMonth = () => {
    const months = [
      'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
      'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
    ];
    const currentIdx = months.indexOf(selectedMonth);
    const years = [realCurrentYear, realCurrentYear + 1];

    if (currentIdx === 0) {
      // Is ENE (0), go back to DIC (11) and toggle year
      setSelectedMonth('DIC');
      if (selectedYear === years[0]) {
        setSelectedYear(years[1]);
      } else {
        setSelectedYear(years[0]);
      }
    } else {
      setSelectedMonth(months[currentIdx - 1]);
    }
  };

  const handleNextMonth = () => {
    const months = [
      'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
      'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
    ];
    const currentIdx = months.indexOf(selectedMonth);
    const years = [realCurrentYear, realCurrentYear + 1];

    if (currentIdx === 11) {
      // Is DIC (11), go back to ENE (0) and toggle year
      setSelectedMonth('ENE');
      if (selectedYear === years[1]) {
        setSelectedYear(years[0]);
      } else {
        setSelectedYear(years[1]);
      }
    } else {
      setSelectedMonth(months[currentIdx + 1]);
    }
  };

  // Check if dropdowns should be RED (B4A exact validation: "Alerta en color Rojo si se selecciona mes o año diferente que el actual")
  const isMonthActual = selectedMonth === nombreMes(realCurrentMonthIdx + 1);
  const isYearActual = selectedYear === realCurrentYear;
  const isDefaultSelected = isMonthActual && isYearActual;

  // Render the calendar grid cells
  const offset = getPrimerDiaOffset(selectedMonth, selectedYear);
  const totalDays = getCantDiasDeEsteMes(selectedMonth, selectedYear);
  const cells = [];
  let tooth = getPrimerDienteDeEsteMes(selectedMonth, selectedYear, selectedGroup);

  let tempDiaActual = -offset + 1;

  for (let x = 0; x < 42; x++) {
    const isValidDay = tempDiaActual >= 1 && tempDiaActual <= totalDays;
    const groupLimit = getPeriodo(selectedGroup);

    // Loop through rotation tooth value
    let toothClamped = tooth;
    while (toothClamped > groupLimit) {
      toothClamped -= groupLimit;
    }

    if (!isValidDay) {
      cells.push({
        day: null,
        shift: 'NADA' as ShiftType,
        tooth: null,
      });
    } else {
      let shift: ShiftType = 'NADA';
      const cleanedGroup = selectedGroup.trim();

      if (['A', 'B', 'C', 'D'].includes(cleanedGroup)) {
        shift = getColorrABCD(toothClamped);
      } else if (['E', 'F'].includes(cleanedGroup)) {
        shift = getColorrEF(toothClamped);
      } else if (['N', 'O'].includes(cleanedGroup)) {
        shift = getColorrNO(toothClamped);
      } else if (['P', 'Q'].includes(cleanedGroup)) {
        shift = getColorrPQ(toothClamped);
      } else if (['U', 'V', 'W'].includes(cleanedGroup)) {
        shift = getColorrUVW(toothClamped, uvwRotation);
      } else if (['X', 'Y', 'Z'].includes(cleanedGroup)) {
        shift = getColorrXYZ(toothClamped);
      }

      cells.push({
        day: tempDiaActual,
        shift,
        tooth: toothClamped,
      });

      // B4A increments tooth ONLY if it was a valid day
      tooth = tooth + 1;
    }

    tempDiaActual = tempDiaActual + 1;
  }

  // Get color mapping styles for calendar grid backgrounds
  const getShiftCellStyles = (shift: ShiftType, isToday: boolean) => {
    let styles = { bg: '', text: '' };

    switch (shift) {
      case 'D': // Mañana / yellow
        styles = {
          bg: 'bg-linear-to-br from-yellow-100 to-yellow-300 hover:from-yellow-200 hover:to-yellow-400 border border-yellow-200',
          text: 'text-yellow-900 font-medium',
        };
        break;
      case 'N': // Noche / magenta
        styles = {
          bg: 'bg-linear-to-br from-[#fd4ecc] to-[#b60c9e] hover:from-[#fe6adb] hover:to-[#cc0eae] text-white border border-pink-400',
          text: 'text-white font-medium',
        };
        break;
      case 'F': // Franco / green
        styles = {
          bg: 'bg-linear-to-br from-[#66ff66] to-[#336600] hover:from-[#7cff7c] hover:to-[#3e7c00] text-white border border-green-600',
          text: 'text-white font-medium',
        };
        break;
      default: // Empty / gray
        styles = {
          bg: 'bg-gray-100/70 text-gray-400 border border-gray-200/50',
          text: 'text-gray-400',
        };
    }

    if (isToday) {
      // Pintamos hoy del color de turno correspondiente, pero agregamos un sutil anillo azul y sombra para identificarlo
      styles.bg = `${styles.bg} ring-2 ring-blue-500 shadow-md shadow-blue-500/20 scale-[1.03] z-5 relative`;
      
      // La tipografía para hoy será bold italic y un punto de tamaño mayor
      styles.text = styles.text.replace('font-medium', '') + ' font-extrabold italic text-base sm:text-lg';
    }

    return styles;
  };

  const groupsList = [
    '   A', '   B', '   C', '   D',
    '   E', '   F',
    '   N', '   O',
    '   P', '   Q',
    '   U', '   V', '   W',
    '   X', '   Y', '   Z',
  ];

  const monthsList = [
    'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
    'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
  ];

  const yearsList = [realCurrentYear, realCurrentYear + 1];

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 font-sans flex flex-col justify-between selection:bg-red-500 selection:text-white" id="main-view-container">
      
      {/* 1. BRANDED ANIMATED SPLASH SCREEN */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            id="splash-screen"
            initial={{ opacity: 1 }}
            animate={{ opacity: fadeSplash ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white"
          >
            <div className="flex flex-col items-center px-4 max-w-full text-center">
              <motion.div
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1.85, opacity: 1 }}
                transition={{
                  duration: 3.5,
                  ease: 'easeOut',
                }}
                className="flex flex-col items-center"
              >
                {/* Central Glowing Shield Icon */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-red-600 rounded-full blur-2xl opacity-40 animate-pulse" />
                  <div className="relative w-[71px] h-[71px] rounded-full overflow-hidden flex items-center justify-center shadow-2xl">
                    <img
                      src={cocaColaCap}
                      alt="Coca-Cola Cap"
                      className="w-full h-full object-cover rounded-full scale-[1.35]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <h1 className="text-3xl font-extrabold tracking-wider text-white">
                  FEMSA
                </h1>
              </motion.div>


              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="mt-20 flex gap-1.5 items-center justify-center"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-bounce"></div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN APPLICATION CONTENT */}
      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col justify-between bg-slate-900 border-x border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow effect headers */}
        <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-red-500/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-1/2 h-32 bg-green-500/5 blur-3xl pointer-events-none rounded-full" />

        {/* HEADER BAR */}
        <header className="p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-10 flex items-center justify-center relative">
          <button
            onClick={() => setIsAboutOpen(true)}
            className="flex items-center gap-2 group cursor-pointer text-center focus:outline-hidden"
            title="Ver Historial de Versiones"
            id="femsa-header-title-btn"
          >
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1">
                Calendario Planta Alcorta
              </h2>
              <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest leading-none">
                Versión 3.45 WEB
              </p>
              <p className="text-[10px] text-gray-400 font-bold italic mt-1 leading-none">
                by Ale Corvi © 2026
              </p>
            </div>
          </button>
        </header>

        {/* CONTAINER CONTENT */}
        <main className="p-4 space-y-5 flex-1 flex flex-col justify-start">
          
          {/* SECTION A: DROP DOWN CONTROLS */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-4 shadow-inner" id="picker-controls">
            
            {/* Top row: selectors */}
            <div className="grid grid-cols-3 gap-3 items-end">
              
              {/* Spinner 1: Month Selection */}
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm font-bold tracking-wide focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 cursor-pointer appearance-none ${
                      isMonthActual ? 'text-white' : 'text-red-500 font-extrabold'
                    }`}
                    id="combo1-month-select"
                  >
                    {monthsList.map((m) => (
                      <option key={m} value={m} className="bg-slate-950 text-white font-mono font-medium">
                        {m}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Spinner 2: Year Selection */}
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                    className={`w-full p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm font-bold tracking-wide focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 cursor-pointer appearance-none ${
                      isYearActual ? 'text-white' : 'text-red-500 font-extrabold'
                    }`}
                    id="combo2-year-select"
                  >
                    {yearsList.map((y) => (
                      <option key={y} value={y} className="bg-slate-950 text-white font-mono font-medium">
                        {y}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Spinner 3: Group Selection */}
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <select
                    value={selectedGroup}
                    onChange={(e) => handleGroupChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white text-sm font-bold tracking-wider focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 cursor-pointer appearance-none"
                    id="combo3-group-select"
                  >
                    {groupsList.map((g) => (
                      <option key={g} value={g} className="bg-slate-950 text-white font-mono font-medium">
                        Grupo {g.trim()}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

            </div>

            {/* Red alert text warning if not current month/year */}
            {!isDefaultSelected && (
              <p className="text-center text-[11px] font-semibold text-red-500 animate-pulse leading-snug">
                ⚠️ Alerta: Estás consultando un mes o año diferente al actual.
              </p>
            )}
          </div>

          {/* SECTION B: SHIFT CALENDAR GRID */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 shadow-lg flex-1 flex flex-col justify-between" id="calendar-grid-card">
            
            {/* Weekday headers LU to DO */}
            <div className="grid grid-cols-7 text-center pb-2 border-b border-slate-800">
              {['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'].map((dayName) => (
                <span
                  key={dayName}
                  className={`text-xs font-bold tracking-wider py-1 ${
                    ['SA', 'DO'].includes(dayName) ? 'text-red-400' : 'text-slate-400'
                  }`}
                >
                  {dayName}
                </span>
              ))}
            </div>

            {/* Grid Days - exactly 42 slots */}
            <div className="grid grid-cols-7 gap-1.5 pt-3 flex-1 content-center min-h-[240px]">
              {cells.map((cell, idx) => {
                const isToday =
                  cell.day !== null &&
                  isMonthActual &&
                  isYearActual &&
                  cell.day === realCurrentDay;

                const style = getShiftCellStyles(cell.shift, isToday);

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (cell.day !== null) {
                        setDetailDay(cell.day);
                      }
                    }}
                    disabled={cell.day === null}
                    className={`relative aspect-square flex items-center justify-center rounded-lg text-sm transition-all focus:outline-hidden ${
                      cell.day !== null
                        ? 'cursor-pointer transform active:scale-95'
                        : 'opacity-20 cursor-default'
                    } ${style.bg}`}
                    id={`calendar-cell-${idx}`}
                  >
                    <span className={`${style.text} ${isToday ? 'animate-scale-pulse' : ''}`}>
                      {cell.day !== null ? cell.day : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Previous, Home/Franco & Next navigation styled as Mañana, Franco & Noche buttons */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800" id="month-navigation-controls">
              
              {/* Previous month (Mañana reference) */}
              <button
                onClick={handlePrevMonth}
                className="flex items-center justify-center gap-1 py-2.5 px-0.5 bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 active:from-yellow-600 active:to-yellow-700 text-slate-950 font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-98 text-center"
                id="prev-month-btn"
                title="Ir al mes anterior (Mañana)"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span className="font-mono tracking-wider font-extrabold text-[11px] uppercase">MAÑANA</span>
              </button>

              {/* Reset to Today (Franco reference and Secret Config trigger) */}
              <button
                onClick={handleFrancoClick}
                className="flex flex-col items-center justify-center py-2.5 px-0.5 bg-linear-to-r from-[#5aff5a] to-[#257500] hover:from-[#6fff6f] hover:to-[#2e9200] text-slate-950 font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-98 text-center"
                id="franco-today-btn"
                title="Volver a Hoy (Franco) / Toca 3 veces para Configuración UVW"
              >
                <span className="font-mono tracking-wider font-extrabold text-[11px] uppercase">FRANCO</span>
              </button>

              {/* Next month (Noche reference) */}
              <button
                onClick={handleNextMonth}
                className="flex items-center justify-center gap-1 py-2.5 px-0.5 bg-linear-to-r from-[#fd4ecc] to-[#b60c9e] hover:from-[#fe6bda] hover:to-[#cc11b2] text-white font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-98 text-center"
                id="next-month-btn"
                title="Ir al mes siguiente (Noche)"
              >
                <span className="font-mono tracking-wider font-extrabold text-[11px] uppercase">NOCHE</span>
                <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />
              </button>

            </div>

          </div>

          {/* SECTION D: UVW CONFIGURATION ROTATION */}
          <AnimatePresence>
            {showUvwConfig && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: 10 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3 overflow-hidden"
                id="uvw-rotation-panel"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <Settings2 className="w-4 h-4 text-slate-400" />
                  <h4 className="text-[11px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                    Configuración Rotación UVW (referencia FRANCO)
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3" id="uvw-radio-buttons">
                  <button
                    onClick={() => handleUvwRotationChange('normal')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                      uvwRotation === 'normal'
                        ? 'bg-slate-900 border-red-500 ring-1 ring-red-500/20 text-white'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900/50 hover:text-slate-300'
                    }`}
                    id="uvw-rot-normal-btn"
                  >
                    <Sun className="w-4 h-4 mb-1 text-yellow-400 shrink-0 animate-spin-slow" />
                    <span className="text-xs font-semibold">Rotación Normal</span>
                    <span className="text-[9px] font-mono text-slate-500 text-center leading-none mt-1">
                      Viernes y Sábado Franco
                    </span>
                  </button>

                  <button
                    onClick={() => handleUvwRotationChange('changed')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                      uvwRotation === 'changed'
                        ? 'bg-slate-900 border-red-500 ring-1 ring-red-500/20 text-white'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900/50 hover:text-slate-300'
                    }`}
                    id="uvw-rot-changed-btn"
                  >
                    <Moon className="w-4 h-4 mb-1 text-slate-400 shrink-0" />
                    <span className="text-xs font-semibold">Rotación Cambiada</span>
                    <span className="text-[9px] font-mono text-slate-500 text-center leading-none mt-1">
                      Jueves y Viernes Franco
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>

      </div>

      {/* MODALS AND DETAIL POPUPS */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      <ShiftDetailModal
        isOpen={detailDay !== null}
        onClose={() => setDetailDay(null)}
        day={detailDay}
        month={selectedMonth}
        year={selectedYear}
        uvwRotation={uvwRotation}
      />

    </div>
  );
}
