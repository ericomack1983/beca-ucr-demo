export type Sender = "ucr" | "issuer";
export type MessageStatus = "read" | "unread";
export type MessageCategory = "info" | "action_required" | "receipt" | "decision";

export interface Message {
  id: string;
  studentId: string;
  sender: Sender;
  senderName: string;
  senderEmail: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  status: MessageStatus;
  category: MessageCategory;
  actionChip?: {
    label: string;
    href: string;
  };
  thread?: Message[];
}

export const MOCK_MESSAGES: Message[] = [
  // ── María (stu_001) ─────────────────────────────────────────────────────────
  {
    id: "msg_001",
    studentId: "stu_001",
    sender: "ucr",
    senderName: "Oficina de Becas UCR",
    senderEmail: "becas@ucr.ac.cr",
    subject: "Bienvenida a Costa Rica Becas, María",
    preview: "Estimada María, nos complace confirmar que su solicitud ha sido recibida exitosamente...",
    body: `Estimada **María Fernández Solano**,

Nos complace confirmar que ha iniciado exitosamente su proceso de solicitud de beca en la **Universidad de Costa Rica**.

Su expediente ha sido asignado al sistema de gestión con el folio **#2026-05-B12345**. A continuación, encontrará un resumen de los próximos pasos:

1. **Completar su perfil socioeconómico** — necesario para la evaluación de elegibilidad.
2. **Cargar todos los documentos requeridos** — verifique la lista completa en la sección de Documentos.
3. **Esperar la evaluación del motor de riesgo** — el proceso toma entre 3 y 5 días hábiles.

Para cualquier consulta, puede responder a este mensaje o contactarnos directamente al **2511-4567** (lunes a viernes, 8:00 a.m. – 4:30 p.m.).

— Oficina de Becas, Universidad de Costa Rica`,
    timestamp: "2026-05-08T09:30:00Z",
    status: "read",
    category: "info",
  },
  {
    id: "msg_002",
    studentId: "stu_001",
    sender: "ucr",
    senderName: "Oficina de Becas UCR",
    senderEmail: "becas@ucr.ac.cr",
    subject: "Documento recibido: Cédula de identidad",
    preview: "Confirmamos la recepción de su Cédula de Identidad. El documento está siendo verificado...",
    body: `Estimada **María**,

Le confirmamos la recepción del siguiente documento:

> **Cédula de Identidad Nacional**
> Folio: DOC-2026-001 · Tamaño: 1.2 MB · Formato: PDF

El documento se encuentra actualmente **en proceso de verificación**. Recibirá una notificación cuando sea aprobado o en caso de requerir alguna corrección.

**Estado del expediente:** 2 de 4 documentos requeridos recibidos.

— Oficina de Becas, Universidad de Costa Rica`,
    timestamp: "2026-05-09T10:15:00Z",
    status: "read",
    category: "receipt",
  },
  {
    id: "msg_003",
    studentId: "stu_001",
    sender: "issuer",
    senderName: "Issuer — Motor de Riesgo",
    senderEmail: "evaluacion@issuer.cr",
    subject: "Inicio de evaluación de riesgo socioeconómico",
    preview: "Su solicitud ha sido recibida por el motor de evaluación. El proceso de análisis ha comenzado...",
    body: `**Inicio de Evaluación de Riesgo Socioeconómico**

Su expediente ha ingresado al sistema de análisis de **Issuer Risk Services**.

**Datos de la evaluación:**
- Folio de referencia: ISS-2026-B12345
- Tipo de análisis: Socioeconómico Integral
- Modalidad: Automático + Revisión humana
- Tiempo estimado: 3–5 días hábiles

Durante este proceso evaluaremos:
- Capacidad de pago familiar
- Condición socioeconómica del hogar
- Historial académico
- Factores regionales de acceso

Recibirá una notificación con los resultados al concluir la evaluación.

*Este mensaje es generado automáticamente por el sistema Issuer. No responda a este correo.*

— Equipo de Evaluación, Issuer Risk Services`,
    timestamp: "2026-05-10T08:00:00Z",
    status: "read",
    category: "info",
  },
  {
    id: "msg_004",
    studentId: "stu_001",
    sender: "issuer",
    senderName: "Issuer — Motor de Riesgo",
    senderEmail: "evaluacion@issuer.cr",
    subject: "Documento adicional requerido: Comprobante de ingresos actualizado",
    preview: "Para completar su evaluación, necesitamos un comprobante de ingresos actualizado (no mayor a 30 días)...",
    body: `**Acción Requerida — Documento Adicional**

Durante la revisión de su expediente, nuestro equipo ha identificado que el **Comprobante de Ingresos** cargado no cumple con los requisitos de vigencia:

> El documento debe tener una emisión **no mayor a 30 días** a la fecha de evaluación.
> Fecha máxima aceptable: **12 de abril de 2026**
> Documento cargado: emitido el **15 de marzo de 2026**

**¿Qué debe hacer?**

1. Solicite un comprobante de ingresos actualizado a su empleador o al CCSS.
2. Cárguelo en la sección de Documentos de su portal.
3. Notifique al sistema utilizando el botón de acción a continuación.

**Plazo máximo de carga:** 13 de mayo de 2026 (48 horas)

Si no se recibe el documento dentro del plazo, su evaluación quedará en estado de pausa hasta su presentación.

— Equipo de Evaluación, Issuer Risk Services`,
    timestamp: "2026-05-11T09:00:00Z",
    status: "unread",
    category: "action_required",
    actionChip: {
      label: "Subir documento",
      href: "/dashboard/documentos",
    },
  },

  // ── Carlos (stu_002) ─────────────────────────────────────────────────────────
  {
    id: "msg_010",
    studentId: "stu_002",
    sender: "ucr",
    senderName: "Oficina de Becas UCR",
    senderEmail: "becas@ucr.ac.cr",
    subject: "Bienvenido a Costa Rica Becas, Carlos",
    preview: "Estimado Carlos, nos complace confirmar que su solicitud ha sido recibida exitosamente...",
    body: `Estimado **Carlos Méndez Quirós**,

Nos complace confirmar que ha iniciado su proceso de solicitud de beca con el folio **#2026-04-B23456**.

Nuestro equipo estará acompañándole en cada etapa del proceso.

— Oficina de Becas, Universidad de Costa Rica`,
    timestamp: "2026-04-20T09:30:00Z",
    status: "read",
    category: "info",
  },
  {
    id: "msg_011",
    studentId: "stu_002",
    sender: "issuer",
    senderName: "Issuer — Motor de Riesgo",
    senderEmail: "evaluacion@issuer.cr",
    subject: "Inicio de evaluación de riesgo socioeconómico",
    preview: "Su expediente ha ingresado al sistema de análisis de Issuer Risk Services...",
    body: `**Inicio de Evaluación de Riesgo Socioeconómico**

Su expediente ha ingresado al sistema de análisis de Issuer Risk Services con folio ISS-2026-B23456.

El proceso tomará entre 3 y 5 días hábiles.

— Equipo de Evaluación, Issuer Risk Services`,
    timestamp: "2026-04-25T08:00:00Z",
    status: "read",
    category: "info",
  },
  {
    id: "msg_012",
    studentId: "stu_002",
    sender: "issuer",
    senderName: "Issuer — Motor de Riesgo",
    senderEmail: "evaluacion@issuer.cr",
    subject: "Evaluación completada — Tier: LOW RISK",
    preview: "Su evaluación de riesgo ha concluido con un resultado favorable. Puntaje: 82/100...",
    body: `**Evaluación de Riesgo Completada**

Su evaluación socioeconómica ha concluido con los siguientes resultados:

---

**Puntaje Final: 82 / 100**
**Clasificación: LOW RISK**
**Decisión: APROBADO para revisión de Oficina de Becas**

---

**Factores evaluados:**

- Ingreso per cápita familiar bajo el umbral de elegibilidad
- Vivienda en condición de alquiler — indicador de vulnerabilidad socioeconómica
- Región rural con menor acceso histórico a oportunidades educativas
- Desempeño académico sobresaliente (promedio general 8.9/10)

**Interpretación:** Su perfil socioeconómico presenta un riesgo bajo de incumplimiento y una alta necesidad de apoyo financiero. El expediente ha sido remitido a la Oficina de Becas UCR para la decisión final.

— Equipo de Evaluación, Issuer Risk Services`,
    timestamp: "2026-04-28T10:00:00Z",
    status: "read",
    category: "info",
  },
  {
    id: "msg_013",
    studentId: "stu_002",
    sender: "ucr",
    senderName: "Oficina de Becas UCR",
    senderEmail: "becas@ucr.ac.cr",
    subject: "Solicitud aprobada — Próximos pasos",
    preview: "Nos alegra informarle que su solicitud de Beca de Trabajo ha sido aprobada. A continuación encontrará...",
    body: `¡Felicitaciones, **Carlos**!

Nos alegra comunicarle que su solicitud de **Beca de Trabajo UCR** ha sido **aprobada** para el ciclo lectivo 2026.

---

**Detalles de la beca:**
- Tipo: Beca de Trabajo
- Modalidad: Asistencia de 20 horas semanales
- Beneficio mensual: ₡210,000
- Duración: Agosto 2026 – Julio 2027 (renovable)

---

**Próximos pasos:**

1. **Firmar contrato de beca** — Se le enviará a su correo institucional dentro de los próximos 3 días hábiles.
2. **Coordinar con la unidad asignada** — Recibirá información de contacto del supervisor de su asistencia.
3. **Activar su expediente en la Plataforma Administrativa UCR** — Requiere su presencia en la Oficina de Becas con cédula de identidad.

Para consultas, contáctenos al **2511-4567**.

— Oficina de Becas, Universidad de Costa Rica`,
    timestamp: "2026-05-01T10:00:00Z",
    status: "read",
    category: "decision",
  },
];

export function getMessagesByStudentId(studentId: string): Message[] {
  return MOCK_MESSAGES.filter((m) => m.studentId === studentId);
}

export function getUnreadCount(studentId: string): number {
  return MOCK_MESSAGES.filter(
    (m) => m.studentId === studentId && m.status === "unread"
  ).length;
}
