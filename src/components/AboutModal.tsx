/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Award, Info, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const versions = [
    { ver: 'v3.45 Web', desc: 'Misma funcionalidad que la versión Android, permitiendo además su uso en Iphone, PC y cualquier navegador web' },
    { ver: 'v3.45', desc: 'Compatibilidad con Android 16. Optimización de renderizado y escalado adaptable.' },
    { ver: 'v3.43', desc: 'Compatibilidad con Android 14.' },
    { ver: 'v3.39', desc: 'Versión final estable.' },
    { ver: 'v3.38', desc: 'Presentación animada.' },
    { ver: 'v3.29', desc: 'Corrección Panel2 Grupo NO.' },
    { ver: 'v3.27', desc: 'Mejora en interfaz Grupos UVW.' },
    { ver: 'v3.26', desc: 'Acceso a configuración de los grupos UVW -referencia FRANCO-.' },
    {
      ver: 'v2.78',
      desc: 'Mejora en el desplazamiento entre meses - mes próximo referencia NOCHE y mes anterior referencia MAÑANA. Alerta en color Rojo si se selecciona mes o año diferente que el actual. Se agregan los turnos N y O. Actualización automática de los años Actual y Próximo.',
    },
    { ver: 'v2.51', desc: 'Título en pantalla. Picando sobre el mismo se accede a los datos de versión actual y mejoras en versiones anteriores.' },
    { ver: 'v2.47', desc: 'Se agregan los turnos EF y PQ.' },
    {
      ver: 'v2.43',
      desc: 'Día actual resaltado en color celeste (ahora azul) para mejor ubicación en el calendario. Remanencia del Turno seleccionado. Posibilidad de conocer la situación de cada uno de los turnos picando sobre una fecha determinada.',
    },
    { ver: 'v1.32', desc: 'Se agregan los turnos UVW. Mejora de la interfaz gráfica autoajustando su tamaño a la pantalla del celular.' },
    { ver: 'v1.1', desc: 'Se agregan los turnos XYZ.' },
    { ver: 'v1.0', desc: 'Cuarto turno básico ABCD.' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="relative p-6 bg-linear-to-r from-red-600 to-red-700 text-white flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Calendario Femsa V3.45 Web</h3>
                <p className="text-xs text-white/80">(2018-2026) · All rights and lefts reserved</p>
              </div>
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-1 text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
                aria-label="Cerrar"
                id="close-about-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex gap-3 items-start p-4 bg-red-50/50 rounded-xl border border-red-100/50">
                <Award className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm text-gray-900">Aplicación NO oficial de turnos rotativos</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Esta herramienta permite consultar los diagramas de turnos de manera interactiva para todos los grupos de trabajadores en Coca Cola FEMSA (Planta Alcorta).
                  </p>
                </div>
              </div>

              {/* Version list */}
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <Info className="w-4 h-4" />
                  <span>Historial de versiones</span>
                </div>

                <div className="space-y-3 relative before:absolute before:inset-y-3 before:left-3 before:w-[2px] before:bg-gray-100">
                  {versions.map((v, idx) => (
                    <div key={idx} className="relative pl-8 flex gap-3 text-sm items-start">
                      <div className="absolute left-[8px] top-2 w-[7px] h-[7px] rounded-full bg-red-500 ring-4 ring-white shrink-0" />
                      <div>
                        <span className="font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs">
                          {v.ver}
                        </span>
                        <p className="text-gray-600 mt-1 text-xs leading-relaxed">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-all shadow-md shadow-red-200 cursor-pointer"
                id="close-about-footer-btn"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
