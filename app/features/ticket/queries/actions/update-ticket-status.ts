"use server";

import {
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { prisma } from "../../../../../lib/prisma";
import { TicketStatus } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { ticketsPath } from "@/paths";

const updateTicketStatus = async (id: string, status: TicketStatus) => {
  try {
    await prisma.ticket.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    fromErrorToActionState(error);
    console.error("Error updating ticket status:", error);
  }

  revalidatePath(ticketsPath());

  return toActionState("SUCCESS", "Ticket status updated successfully.");
};

export { updateTicketStatus };
