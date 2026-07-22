import React, { useState } from "react";
import { ReportData, Equipment, OrderType } from "../types";
import { Plus, Trash2, User, Calendar, HardDrive, Search } from "lucide-react";

interface ReportFormProps {
  data: ReportData;
  onChange: (updatedData: ReportData) => void;
}

const COMMON_MATERIALS = [
  // Equipos y CPEs
  { descripcion: "60584 - ONT WIFI 7 HG8145B7N-50", unidad: "PZA", especificaciones: "Lote: TPE NUEVO" },
  { descripcion: "72676 - ONT HG8145V5 SMALL", unidad: "PZA", especificaciones: "Lote: TPE REFURB" },
  { descripcion: "74497 - AP FIBERHOME MODELO SR1041E WIFI 6", unidad: "PZA", especificaciones: "Lote: TPE NUEVO" },
  { descripcion: "67367 - VIDEO SOUNDBOX VSB3940 TPL", unidad: "PZA", especificaciones: "Lote: TPE O REFURB" },
  { descripcion: "81809 - DIW362 WI-FI 2X2 4K STB 2 GB SAGEM", unidad: "PZA", especificaciones: "Lote: TPE REFURB" },
  { descripcion: "69746 - DIW372 4K STB 2 B SAGEM C/CONTROL S/WIFI", unidad: "PZA", especificaciones: "Lote: TPE REFURB" },
  { descripcion: "73488 - DECODIFICADOR MICROPHONES - IPTV DIW377V NUEVO", unidad: "PZA", especificaciones: "Lote: TPE NUEVO" },
  { descripcion: "Decodificador Totalplay Smart Box", unidad: "PZA", especificaciones: "Smart Box" },
  
  // Fibra y Cables
  { descripcion: "73170 - UNIFIBRA OPTICA DROP", unidad: "Metros", especificaciones: "Lote: TPI NUEVO" },
  { descripcion: "Fibra Óptica 1 Hilo Drop Flat", unidad: "Metros", especificaciones: "Drop Flat" },
  { descripcion: "74529 - CAB UTP CAT 6 BLANCO OUTDOOR BOB 305MTS", unidad: "Metros", especificaciones: "Lote: TPI NUEVO" },
  { descripcion: "75070 - PRECONECTORIZADO(SC/APC-SC/APC) BALA-100", unidad: "PZA", especificaciones: "Lote: TPE NUEVO" },
  { descripcion: "75073 - PRECONECTORIZADO(SC/APC-SC/APC) BALA-250", unidad: "PZA", especificaciones: "Lote: TPE NUEVO" },
  { descripcion: "89313 - PRECONECTORIZADO SC/APC-SC/APC BALA-200", unidad: "PZA", especificaciones: "Lote: TPE NUEVO" },
  { descripcion: "66225 - CABLE RCA MINI JACK STB", unidad: "PZA", especificaciones: "Lote: TPI NUEVO" },
  { descripcion: "Cable Ethernet RJ45 Cat 5e", unidad: "PZA", especificaciones: "Cat 5e" },

  // Herrajes y Accesorios
  { descripcion: "16036 - HERRAJE TIPO D 5MM GALVANIZADO INMERSION", unidad: "PZA", especificaciones: "Lote: TPI NUEVO" },
  { descripcion: "17972 - TENSOR PARA ACOMETIDA", unidad: "PZA", especificaciones: "Lote: TPI NUEVO" },
  { descripcion: "16109 - FLEJE DE ACERO 5/8 CAJA 30 METROS C/U O", unidad: "Metros", especificaciones: "Lote: TPI NUEVO" },
  { descripcion: "16637 - HEBILLA ACERO 5/8", unidad: "PZA", especificaciones: "Lote: TPI NUEVO" },
  { descripcion: "16113 - CINCHO NEGRO 0.36X15 CM C/100 PZAS", unidad: "PZA", especificaciones: "Lote: TPI NUEVO" },
  { descripcion: "16165 - GRAPA P/CABLE TELEFONICO REDONDO BCO", unidad: "PZA", especificaciones: "Lote: TPI NUEVO" },
  { descripcion: "16166 - GRAPA P/CABLE COAX BCA CLAVO 3/4", unidad: "PZA", especificaciones: "Lote: TPI NUEVO" },
  { descripcion: "16635 - ARMELLA CERRADA 20 X 70", unidad: "PZA", especificaciones: "Lote: TPI NUEVO" },
  { descripcion: "16638 - PIJA CABEZA/CRUZ DE 10 X 1", unidad: "PZA", especificaciones: "Lote: TPI NUEVO" },
  { descripcion: "16639 - TAQUETE PLASTICO 1/4", unidad: "PZA", especificaciones: "Lote: TPI NUEVO" },
  { descripcion: "69022 - BOTA PARA CAJA N2 OPTITAP 460", unidad: "PZA", especificaciones: "Lote: TPI O CAPEX" },
  { descripcion: "80047 - FORMATOS UNIVERSALES DE SOPORTE O", unidad: "PZA", especificaciones: "Lote: TPI NUEVO" },
  
  // Otros comunes
  { descripcion: "16383 - CONECTOR PREPULIDO 250UM", unidad: "PZA", especificaciones: "Lote: TPI NUEVO" },
  { descripcion: "66813 - CONECTOR RJ45 CAT 6 Lote: TPI NUEVO", unidad: "PZA", especificaciones: "Lote: TPI NUEVO" },
  { descripcion: "Conector Mecánico SC/APC", unidad: "PZA", especificaciones: "Azul/Verde" },
  { descripcion: "Roseta Óptica SC/APC", unidad: "PZA", especificaciones: "Roseta" },
  { descripcion: "Cargador ONT 12V 1.5A", unidad: "PZA", especificaciones: "12V 1.5A" },
];

export default function ReportForm({ data, onChange }: ReportFormProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleFieldChange = (field: keyof ReportData, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleEquipmentChange = (index: number, field: keyof Equipment, value: string) => {
    const updatedEquipos = [...data.equipos];
    updatedEquipos[index] = {
      ...updatedEquipos[index],
      [field]: value,
    };
    onChange({
      ...data,
      equipos: updatedEquipos,
    });
  };

  const addEquipment = (preselected?: Partial<Equipment>) => {
    const newEquip: Equipment = {
      id: Math.random().toString(36).substr(2, 9),
      cantidad: preselected?.cantidad || "1",
      unidad: preselected?.unidad || "PZA",
      descripcion: preselected?.descripcion || "",
      especificaciones: preselected?.especificaciones || "",
      mac: preselected?.mac || "",
    };
    onChange({
      ...data,
      equipos: [...data.equipos, newEquip],
    });
  };

  const removeEquipment = (index: number) => {
    const updatedEquipos = data.equipos.filter((_, i) => i !== index);
    onChange({
      ...data,
      equipos: updatedEquipos,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Editor de Datos</h2>
          <p className="text-xs text-slate-400">Revisa y ajusta los detalles del reporte extraídos por la IA</p>
        </div>

        {/* Order Type Selector */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          {(["instalacion", "soporte", "planta", "mantenimiento"] as OrderType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleFieldChange("orderType", type)}
              className={`flex-1 sm:flex-none text-xs font-medium py-1.5 px-3 rounded-lg transition-all capitalize ${
                data.orderType === type
                  ? "bg-primary text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {type === "instalacion" ? "Instalación" : type === "soporte" ? "Soporte" : type === "planta" ? "Planta Externa" : "Mantenimiento"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* General Metadata */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> Información General
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Fecha</label>
              <input
                type="text"
                value={data.fecha}
                onChange={(e) => handleFieldChange("fecha", e.target.value)}
                placeholder="DD/MM/AAAA"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Orden de Servicio (OS)</label>
              <input
                type="text"
                value={data.os}
                onChange={(e) => handleFieldChange("os", e.target.value)}
                placeholder="OS-XXXXXX"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nombre del Técnico</label>
            <input
              type="text"
              value={data.tecnico}
              onChange={(e) => handleFieldChange("tecnico", e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Gaffete / ID</label>
              <input
                type="text"
                value={data.gaffete}
                onChange={(e) => handleFieldChange("gaffete", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Número de Cuenta</label>
              <input
                type="text"
                value={data.cuenta}
                onChange={(e) => handleFieldChange("cuenta", e.target.value)}
                placeholder="1.XXXXXXXX"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Client & Network Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4" /> Datos de Cliente y Red
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Nombre Completo del Cliente</label>
            <input
              type="text"
              value={data.nombre}
              onChange={(e) => handleFieldChange("nombre", e.target.value)}
              placeholder="Nombre del cliente"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Cuenta Red (CTA)</label>
              <input
                type="text"
                value={data.cta}
                onChange={(e) => handleFieldChange("cta", e.target.value)}
                placeholder="CTA"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Splitter (SP)</label>
              <input
                type="text"
                value={data.sp}
                onChange={(e) => handleFieldChange("sp", e.target.value)}
                placeholder="SP-XX-X"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Puerto (PTO)</label>
              <input
                type="text"
                value={data.pto}
                onChange={(e) => handleFieldChange("pto", e.target.value)}
                placeholder="Port"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {data.orderType !== "planta" && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Candado</label>
                <input
                  type="text"
                  value={data.candado}
                  onChange={(e) => handleFieldChange("candado", e.target.value)}
                  placeholder="Sin candado / Con candado"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-primary"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Ubicación / Dirección Poste</label>
              <input
                type="text"
                value={data.ubicacion}
                onChange={(e) => handleFieldChange("ubicacion", e.target.value)}
                placeholder="Dirección completa, poste, CP"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-primary"
              />
            </div>

            {data.orderType !== "planta" && (
              <div className="flex items-center gap-2.5 p-2 bg-slate-950/60 rounded-xl border border-slate-800/40 mt-1">
                <input
                  type="checkbox"
                  id="pruebasVelocidad"
                  checked={data.pruebasVelocidad !== false}
                  onChange={(e) => handleFieldChange("pruebasVelocidad", e.target.checked)}
                  className="w-4 h-4 rounded border-slate-850 text-primary focus:ring-primary bg-slate-900 cursor-pointer accent-primary"
                />
                <label htmlFor="pruebasVelocidad" className="text-xs font-medium text-slate-300 cursor-pointer select-none">
                  Prueba de velocidad realizada (Speedtest.com para conformidad)
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conditional Fields for Soporte and Planta Externa */}
      {(data.orderType === "soporte" || data.orderType === "planta") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
          {data.orderType === "soporte" && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Falla Reportada</label>
                <input
                  type="text"
                  value={data.fallaReportada || ""}
                  onChange={(e) => handleFieldChange("fallaReportada", e.target.value)}
                  placeholder="Falla, ej: Fibra atenuada, sin navegación, etc."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-[#e30613]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Solución / Trabajo Realizado</label>
                <input
                  type="text"
                  value={data.solucion || ""}
                  onChange={(e) => handleFieldChange("solucion", e.target.value)}
                  placeholder="Solución, ej: Se re-fusiona drop, cambio de roseta, etc."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-[#e30613]"
                />
              </div>
            </>
          )}

          {data.orderType === "planta" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Distrito / Nodo</label>
                  <input
                    type="text"
                    value={data.distritoNodo || ""}
                    onChange={(e) => handleFieldChange("distritoNodo", e.target.value)}
                    placeholder="Nodo o distrito"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-[#e30613]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Estatus Planta Externa</label>
                  <input
                    type="text"
                    value={data.estatusPlanta || ""}
                    onChange={(e) => handleFieldChange("estatusPlanta", e.target.value)}
                    placeholder="Estatus de planta externa"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-[#e30613]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Detalle de Falla o Trabajo</label>
                <input
                  type="text"
                  value={data.fallaReportada || data.solucion || ""}
                  onChange={(e) => {
                    handleFieldChange("fallaReportada", e.target.value);
                    handleFieldChange("solucion", e.target.value);
                  }}
                  placeholder="Descripción del trabajo en planta externa..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-[#e30613]"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Equipments & Materials */}
      <div className="border-t border-slate-800 pt-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-[#e30613] uppercase tracking-wider flex items-center gap-1.5">
            <HardDrive className="w-4 h-4" /> Equipos y Materiales
          </h3>

          <div className="flex gap-2">
            <button
              onClick={() => addEquipment()}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-medium py-1 px-3 rounded-lg border border-slate-700 flex items-center gap-1 transition-all"
            >
              <Plus className="w-3 h-3 text-[#e30613]" /> Personalizado
            </button>
          </div>
        </div>

        {/* Quick Material Adds */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-900 pb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Buscar o Seleccionar Material (Stock Totalplay)
            </span>
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                <Search className="w-3.5 h-3.5 text-slate-500" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ej. ONT, Fibra, 16036..."
                className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-slate-200 focus:outline-none focus:border-[#e30613]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-xs text-slate-500 hover:text-slate-300"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
            {(() => {
              const query = searchQuery.toLowerCase().trim();
              const filtered = COMMON_MATERIALS.filter(
                (mat) =>
                  mat.descripcion.toLowerCase().includes(query) ||
                  (mat.especificaciones && mat.especificaciones.toLowerCase().includes(query))
              );

              if (filtered.length === 0) {
                return (
                  <span className="text-xs text-slate-500 py-1">
                    No se encontraron materiales que coincidan con "{searchQuery}".
                  </span>
                );
              }

              return filtered.map((mat, i) => (
                <button
                  key={i}
                  onClick={() => {
                    addEquipment(mat);
                  }}
                  className="text-[11px] bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-750 text-slate-300 py-1 px-2.5 rounded-lg flex items-center gap-1 transition-all"
                  title={`${mat.descripcion} - ${mat.especificaciones || ""}`}
                >
                  <Plus className="w-2.5 h-2.5 text-emerald-500" />
                  <span>{mat.descripcion}</span>
                  {mat.especificaciones && (
                    <span className="text-[9px] text-slate-500 font-normal">
                      ({mat.especificaciones.replace("Lote: ", "")})
                    </span>
                  )}
                </button>
              ));
            })()}
          </div>
        </div>

        {/* Equipment Lines */}
        <div className="space-y-3">
          {data.equipos.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
              No hay materiales o equipos agregados aún. Agrega uno arriba.
            </div>
          ) : (
            data.equipos.map((eq, index) => (
              <div
                key={eq.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-850 relative group"
              >
                {/* Cantidad & Unidad */}
                <div className="sm:col-span-2 grid grid-cols-2 gap-1">
                  <div>
                    <label className="block text-[9px] font-medium text-slate-500 mb-0.5 sm:hidden">Cant.</label>
                    <input
                      type="text"
                      value={eq.cantidad}
                      onChange={(e) => handleEquipmentChange(index, "cantidad", e.target.value)}
                      placeholder="Cant."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-xs text-slate-200 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-medium text-slate-500 mb-0.5 sm:hidden">Unid.</label>
                    <input
                      type="text"
                      value={eq.unidad}
                      onChange={(e) => handleEquipmentChange(index, "unidad", e.target.value)}
                      placeholder="PZA/m"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-xs text-slate-200 text-center"
                    />
                  </div>
                </div>

                {/* Descripcion */}
                <div className="sm:col-span-4">
                  <label className="block text-[9px] font-medium text-slate-500 mb-0.5 sm:hidden">Descripción</label>
                  <input
                    type="text"
                    value={eq.descripcion}
                    onChange={(e) => handleEquipmentChange(index, "descripcion", e.target.value)}
                    placeholder="Descripción del material"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2.5 text-xs text-slate-200"
                  />
                </div>

                {/* Especificaciones */}
                <div className="sm:col-span-3">
                  <label className="block text-[9px] font-medium text-slate-500 mb-0.5 sm:hidden">Especificaciones</label>
                  <input
                    type="text"
                    value={eq.especificaciones || ""}
                    onChange={(e) => handleEquipmentChange(index, "especificaciones", e.target.value)}
                    placeholder="Especificaciones / Modelo"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2.5 text-xs text-slate-200"
                  />
                </div>

                {/* MAC Address */}
                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-medium text-slate-500 mb-0.5 sm:hidden">Dirección MAC</label>
                  <input
                    type="text"
                    value={eq.mac || ""}
                    onChange={(e) => handleEquipmentChange(index, "mac", e.target.value)}
                    placeholder="Dirección MAC (si aplica)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2.5 text-xs text-slate-200 font-mono"
                  />
                </div>

                {/* Delete button */}
                <div className="sm:col-span-1 flex items-center justify-end">
                  <button
                    onClick={() => removeEquipment(index)}
                    className="p-1 text-slate-500 hover:text-red-500 rounded-lg hover:bg-red-950/20 transition-all"
                    title="Eliminar material"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
