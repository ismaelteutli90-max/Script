export type OrderType = "instalacion" | "soporte" | "planta" | "mantenimiento";

export interface Equipment {
  id: string;
  cantidad: string;
  unidad: string;
  descripcion: string;
  especificaciones?: string;
  mac?: string;
}

export interface ReportData {
  orderType: OrderType;
  fecha: string;
  tecnico: string;
  gaffete: string;
  os: string;
  cuenta: string;
  nombre: string;
  cta: string;
  sp: string;
  pto: string;
  candado: string;
  ubicacion: string;
  equipos: Equipment[];
  fallaReportada?: string;
  solucion?: string;
  distritoNodo?: string;
  estatusPlanta?: string;
  pruebasVelocidad?: boolean;
  script: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  orderType: OrderType;
  os: string;
  cuenta: string;
  nombre: string;
  script: string;
  data: ReportData;
}
