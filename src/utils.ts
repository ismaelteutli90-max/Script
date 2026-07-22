import { ReportData } from "./types";

/**
 * Regenerates the WhatsApp script text based on the report data.
 * Adheres strictly to the guidelines: no markdown bolds (**), precise emojis, and spacing.
 */
export function generateWhatsappScript(data: ReportData): string {
  const {
    orderType,
    fecha,
    tecnico,
    gaffete,
    os,
    cuenta,
    nombre,
    cta,
    sp,
    pto,
    candado,
    ubicacion,
    equipos,
    fallaReportada,
    solucion,
    distritoNodo,
    estatusPlanta,
  } = data;

  const resolvedTecnico = tecnico || "MARIO ISMAEL TEUTLI MARCELINO";
  const resolvedGaffete = gaffete || "MEGE3PUET0498";
  const resolvedFecha = fecha || new Date().toLocaleDateString("es-MX");

  let script = "";

  if (orderType === "instalacion") {
    script += `SCRIPT INSTALACIÓN FINALIZADA\n`;
    script += `🚀\n`;
    script += `📅 ${resolvedFecha}\n`;
    script += `🧔 : ${resolvedTecnico}\n`;
    script += `🆔 ${resolvedGaffete}\n\n`;

    script += `📍 DATOS DEL CLIENTE\n`;
    script += `OS: ${os || ""}\n`;
    script += `CUENTA: ${cuenta || ""}\n`;
    script += `NOMBRE: ${nombre || ""}\n\n`;

    script += `🌐 DATOS DE REDES\n`;
    script += `CTA: ${cta || cuenta || ""}\n`;
    script += `SP. : ${sp || ""}\n`;
    script += `PTO: ${pto || ""}\n`;
    script += `CANDADO: ${candado || "Sin candado"}\n`;
    script += `UBICACIÓN: Poste — ${ubicacion || ""}\n\n`;

    script += `🛠️ EQUIPOS Y MATERIALES\n\n`;
    script += `📦 EQUIPO Y MATERIAL:\n`;
    if (equipos && equipos.length > 0) {
      equipos.forEach((eq, index) => {
        const specPart = eq.especificaciones ? ` (${eq.especificaciones})` : "";
        const macPart = eq.mac ? ` (MAC: ${eq.mac})` : "";
        script += `${index + 1}. ${eq.cantidad || "1"} ${eq.unidad || "PZA"} - ${eq.descripcion || ""}${specPart}${macPart}\n`;
      });
    } else {
      script += `1. 1 PZA - ONT [Modelo ONT] (MAC: [MAC])\n`;
    }

    if (data.pruebasVelocidad) {
      script += `\n⚡ VALIDACIÓN EN SITIO:\n`;
      script += `Se realizan pruebas de velocidad a través de SPEEDTEST.COM para conformidad de TT en el plan contratado. Se deja funcionando servicio.\n`;
    }
  } else if (orderType === "soporte" || orderType === "mantenimiento") {
    script += `SCRIPT ${orderType === "soporte" ? "SOPORTE TÉCNICO" : "MANTENIMIENTO"} FINALIZADO\n`;
    script += `🚀\n`;
    script += `📅 ${resolvedFecha}\n`;
    script += `🧔 : ${resolvedTecnico}\n`;
    script += `🆔 ${resolvedGaffete}\n\n`;

    script += `📍 DATOS DEL CLIENTE\n`;
    script += `OS: ${os || ""}\n`;
    script += `CUENTA: ${cuenta || ""}\n`;
    script += `NOMBRE: ${nombre || ""}\n\n`;

    script += `🌐 DATOS DE REDES\n`;
    script += `CTA: ${cta || cuenta || ""}\n`;
    script += `SP. : ${sp || ""}\n`;
    script += `PTO: ${pto || ""}\n`;
    script += `CANDADO: ${candado || "Sin candado"}\n`;
    script += `UBICACIÓN: Poste — ${ubicacion || ""}\n\n`;

    script += `🛠️ EQUIPOS Y MATERIALES / TRABAJO REALIZADO\n`;
    script += `Falla Reportada/Detalle: ${fallaReportada || ""}\n`;
    script += `Solución/Acción: ${solucion || ""}\n\n`;

    script += `📦 EQUIPO Y MATERIAL REEMPLAZADO/UTILIZADO:\n`;
    if (equipos && equipos.length > 0) {
      equipos.forEach((eq, index) => {
        const specPart = eq.especificaciones ? ` (${eq.especificaciones})` : "";
        const macPart = eq.mac ? ` (MAC: ${eq.mac})` : "";
        script += `${index + 1}. ${eq.cantidad || "1"} ${eq.unidad || "PZA"} - ${eq.descripcion || ""}${specPart}${macPart}\n`;
      });
    } else {
      script += `1. 1 PZA - ONT [Modelo ONT] (MAC: [MAC])\n`;
    }

    if (data.pruebasVelocidad) {
      script += `\n⚡ VALIDACIÓN EN SITIO:\n`;
      script += `Se realizan pruebas de velocidad a través de SPEEDTEST.COM para conformidad de TT en el plan contratado. Se deja funcionando servicio.\n`;
    }
  } else if (orderType === "planta") {
    script += `SCRIPT PLANTA EXTERNA / HÍBRIDO FINALIZADO\n`;
    script += `🚀\n`;
    script += `📅 ${resolvedFecha}\n`;
    script += `🧔 : ${resolvedTecnico}\n`;
    script += `🆔 ${resolvedGaffete}\n\n`;

    script += `📍 DATOS DE LA ORDEN\n`;
    script += `OS: ${os || ""}\n`;
    script += `DISTRITO/NODO: ${distritoNodo || ""}\n`;
    script += `ESTATUS: ${estatusPlanta || "Terminada"}\n\n`;

    script += `🌐 DATOS DE REDES\n`;
    script += `SP. : ${sp || ""}\n`;
    script += `PTO: ${pto || ""}\n`;
    script += `UBICACIÓN: Poste — ${ubicacion || ""}\n\n`;

    script += `🛠️ TRABAJO REALIZADO Y MATERIALES\n`;
    script += `Detalle de Falla/Trabajo: ${fallaReportada || solucion || ""}\n\n`;

    script += `📦 EQUIPO Y MATERIAL UTILIZADO:\n`;
    if (equipos && equipos.length > 0) {
      equipos.forEach((eq, index) => {
        const specPart = eq.especificaciones ? ` (${eq.especificaciones})` : "";
        const macPart = eq.mac ? ` (MAC: ${eq.mac})` : "";
        script += `${index + 1}. ${eq.cantidad || "1"} ${eq.unidad || "PZA"} - ${eq.descripcion || ""}${specPart}${macPart}\n`;
      });
    } else {
      script += `1. 150 Metros - Fibra Óptica 1 hilo\n`;
    }
  }

  return script;
}
