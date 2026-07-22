import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
// Increase body payload limit to support base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const PORT = 3000;

// Initialize GoogleGenAI client lazy to prevent crash if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Process Report endpoint
app.post("/api/process-report", async (req, res) => {
  try {
    const { image, mimeType, images, text } = req.body;

    if (!image && !text && (!images || !Array.isArray(images) || images.length === 0)) {
      return res.status(400).json({ error: "Debe proporcionar capturas de pantalla (imágenes) o texto de Field Cloud." });
    }

    const ai = getGeminiClient();

    // Prepare content parts for Gemini
    const parts: any[] = [];

    // System prompt with templates and instructions
    const promptString = `
Eres un analizador óptico de datos para infraestructura de redes de la empresa Totalplay. 
Tu objetivo es inspeccionar el texto o la captura de pantalla de Field Cloud provista, identificar el tipo de orden (Instalación, Soporte técnico, Planta Externa/Híbrido), extraer los datos clave y rellenar el reporte.

INSTRUCCIONES CRÍTICAS:
1. Extrae los nombres de cliente, números de cuenta, direcciones, splitter (SP), puerto (PTO) y de más campos sin alterar mayúsculas ni minúsculas. No inventes datos.
2. Si un dato no es legible o no viene en la captura/texto, deja el campo de texto vacío en el JSON (es decir, "") y en el script mantén los corchetes vacíos, por ejemplo: "OS: ".
3. Por defecto, si el nombre del técnico o gaffete no se encuentra explícitamente en los datos, debes rellenar con:
   - Técnico: MARIO ISMAEL TEUTLI MARCELINO
   - Gaffete/ID de Técnico: MEGE3PUET0498
4. Determina el tipo de orden ('instalacion', 'soporte' o 'planta') a partir del contenido.
5. El metraje de fibra, conectores mecánicos, ONT u otros materiales deben listarse en la sección de equipos y materiales.
6. En el campo "script" debes generar el texto preformateado y listo para copiar en WhatsApp, usando estrictamente los emojis y espaciados de la plantilla que corresponda al tipo de orden identificado. Está prohibido usar negritas de Markdown (no usar **), títulos introductorios o explicaciones extras.

A continuación se muestran las plantillas de referencia para WhatsApp para cada tipo de orden:

[PLANTILLA INSTALACIÓN]
SCRIPT INSTALACIÓN FINALIZADA
🚀
📅 [Fecha en formato DD/MM/AAAA]
🧔 : [Nombre del Técnico, por defecto: MARIO ISMAEL TEUTLI MARCELINO]
🆔 [ID del Técnico, por defecto: MEGE3PUET0498]

📍 DATOS DEL CLIENTE
OS: [Orden de Servicio]
CUENTA: [Número de Cuenta]
NOMBRE: [Nombre Completo del Cliente]

🌐 DATOS DE REDES
CTA: [Número de Cuenta]
SP. : [Splitter / SP, ej. SP-01-A]
PTO: [Puerto, ej. 4]
CANDADO: Sin candado
UBICACIÓN: Poste — [Dirección Completa con Código Postal]

🛠️ EQUIPOS Y MATERIALES

📦 EQUIPO Y MATERIAL:
1. 1 PZA - [Modelo de ONT / ONT / Decodificador] (MAC: [Dirección MAC, ej: 12:34:56:78:9A:BC])
2. [Cantidad] [Metros/PZA] - [Fibra Óptica / Conector Mecánico / Conector RJ45 / etc.]

---

[PLANTILLA SOPORTE TÉCNICO]
SCRIPT SOPORTE TÉCNICO FINALIZADO
🚀
📅 [Fecha en formato DD/MM/AAAA]
🧔 : [Nombre del Técnico, por defecto: MARIO ISMAEL TEUTLI MARCELINO]
🆔 [ID del Técnico, por defecto: MEGE3PUET0498]

📍 DATOS DEL CLIENTE
OS: [Orden de Servicio]
CUENTA: [Número de Cuenta]
NOMBRE: [Nombre Completo del Cliente]

🌐 DATOS DE REDES
CTA: [Número de Cuenta]
SP. : [Splitter / SP]
PTO: [Puerto]
CANDADO: Sin candado
UBICACIÓN: Poste — [Dirección Completa con Código Postal]

🛠️ EQUIPOS Y MATERIALES / TRABAJO REALIZADO
Falla Reportada: [Falla, ej. Pérdida de señal de fibra / Fibra rota / ONT dañado]
Solución/Acción: [Solución, ej. Empalme por fusión / Cambio de ONT / Cambio de conectores]

📦 EQUIPO Y MATERIAL REEMPLAZADO/UTILIZADO:
1. 1 PZA - [Modelo de ONT / ONT / Decodificador] (MAC: [Dirección MAC])
2. [Cantidad] [Metros/PZA] - [Material utilizado, ej. Conector Mecánico / Metros de fibra]

---

[PLANTILLA PLANTA EXTERNA/HÍBRIDO]
SCRIPT PLANTA EXTERNA / HÍBRIDO FINALIZADO
🚀
📅 [Fecha en formato DD/MM/AAAA]
🧔 : [Nombre del Técnico, por defecto: MARIO ISMAEL TEUTLI MARCELINO]
🆔 [ID del Técnico, por defecto: MEGE3PUET0498]

📍 DATOS DE LA ORDEN
OS: [Orden de Servicio]
DISTRITO/NODO: [Distrito o Nodo]
ESTATUS: [Estatus de la Orden/Trabajo]

🌐 DATOS DE REDES
SP. : [Splitter / SP]
PTO: [Puerto]
UBICACIÓN: Poste — [Dirección Completa con Código Postal]

🛠️ TRABAJO REALIZADO Y MATERIALES
Detalle de Falla/Trabajo: [Descripción del trabajo en planta externa, ej. Reconstrucción de empalme, Corrección de atenuación]

📦 EQUIPO Y MATERIAL UTILIZADO:
1. [Cantidad] [Metros/PZA] - [Material utilizado, ej. 150 Metros de Fibra Optica de 1 hilo, 2 Conectores Mecánicos, etc.]
`;

    parts.push({ text: promptString });

    // Add multiple images if provided in the body
    if (images && Array.isArray(images)) {
      images.forEach((imgObj: any) => {
        if (imgObj.data) {
          parts.push({
            inlineData: {
              mimeType: imgObj.mimeType || "image/png",
              data: imgObj.data,
            },
          });
        }
      });
    } else if (image) {
      parts.push({
        inlineData: {
          mimeType: mimeType || "image/png",
          data: image,
        },
      });
    }

    if (text) {
      parts.push({ text: `Texto extraído de Field Cloud:\n${text}` });
    }

    const config = {
      responseMimeType: "application/json" as const,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          orderType: {
            type: Type.STRING,
            description: "Tipo de orden: 'instalacion', 'soporte', o 'planta'",
          },
          fecha: { type: Type.STRING, description: "Fecha en formato DD/MM/AAAA" },
          tecnico: { type: Type.STRING, description: "Nombre del técnico (por defecto: MARIO ISMAEL TEUTLI MARCELINO)" },
          gaffete: { type: Type.STRING, description: "Gaffete/ID de técnico (por defecto: MEGE3PUET0498)" },
          os: { type: Type.STRING, description: "Orden de Servicio (OS)" },
          cuenta: { type: Type.STRING, description: "Número de cuenta de Totalplay" },
          nombre: { type: Type.STRING, description: "Nombre completo del cliente" },
          cta: { type: Type.STRING, description: "Cuenta de red o cuenta cliente" },
          sp: { type: Type.STRING, description: "Splitter (SP)" },
          pto: { type: Type.STRING, description: "Puerto de fibra (PTO)" },
          candado: { type: Type.STRING, description: "Candado status (ej. Sin candado)" },
          ubicacion: { type: Type.STRING, description: "Ubicación del poste o domicilio con código postal" },
          equipos: {
            type: Type.ARRAY,
            description: "Lista de materiales y equipos utilizados",
            items: {
              type: Type.OBJECT,
              properties: {
                cantidad: { type: Type.STRING, description: "Cantidad (ej. 1, 150, etc)" },
                unidad: { type: Type.STRING, description: "Unidad (ej. PZA, Metros, m, etc)" },
                descripcion: { type: Type.STRING, description: "Descripción del material (ej. ONT Huawei, Fibra de 1 hilo, Conector Mecánico)" },
                especificaciones: { type: Type.STRING, description: "Especificaciones o modelo adicional" },
                mac: { type: Type.STRING, description: "Dirección MAC del dispositivo si aplica" },
              },
            },
          },
          fallaReportada: { type: Type.STRING, description: "Falla reportada (Soporte o Planta Externa)" },
          solucion: { type: Type.STRING, description: "Solución/Trabajo realizado (Soporte o Planta Externa)" },
          distritoNodo: { type: Type.STRING, description: "Distrito o Nodo de Planta Externa si aplica" },
          estatusPlanta: { type: Type.STRING, description: "Estatus del trabajo de planta externa si aplica" },
          script: {
            type: Type.STRING,
            description: "El reporte preformateado y limpio listo para copiar y pegar en WhatsApp. Sin negritas markdown (**), sin saludos, sin explicaciones introductorias ni de cierre.",
          },
        },
        required: ["orderType", "script"],
      },
    };

    const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let response;
    let lastError: any = null;

    for (const model of modelsToTry) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(`Intentando procesar reporte con el modelo ${model} (Intento ${attempt}/2)...`);
          response = await ai.models.generateContent({
            model,
            contents: { parts },
            config,
          });
          break; // Succeeded! Break out of attempts loop
        } catch (error: any) {
          lastError = error;
          console.warn(`Error con modelo ${model} (Intento ${attempt}/2):`, error.message || error);
          if (attempt < 2) {
            // Wait 800ms before retrying the same model
            await new Promise((resolve) => setTimeout(resolve, 800));
          }
        }
      }
      if (response) {
        break; // Succeeded with this model! Break out of models loop
      }
    }

    if (!response) {
      throw lastError || new Error("Todos los intentos con los diferentes modelos fallaron debido a alta demanda.");
    }

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No se pudo obtener una respuesta válida de Gemini.");
    }

    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Error processing report:", error);
    res.status(500).json({
      error: "Error al procesar el reporte con Inteligencia Artificial.",
      details: error.message || error,
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
