import { CircleCheck, Pencil, FileText } from "lucide-react";

const TICKET_ICONS = {
  OPEN: <FileText />,
  IN_PROGRESS: <Pencil />,
  CLOSED: <CircleCheck />,
};

const TICKET_STATUS_LABELS = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  CLOSED: "Closed",
};

export { TICKET_ICONS, TICKET_STATUS_LABELS };
