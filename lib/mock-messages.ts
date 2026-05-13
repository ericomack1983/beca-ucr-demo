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
