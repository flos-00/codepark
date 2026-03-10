"use server";

import { redirect } from "next/navigation";
import { prisma } from "../../../../../lib/prisma";
import { ticketsPath } from "@/paths";
import { revalidatePath } from "next/cache";
import { setCookieByKey } from "@/actions/cookies";

export const deleteTicket = async (ticketId: string) => {
  await prisma.ticket.delete({
    where: { id: ticketId },
  });
  // TODO: Add flash message for successful deletion

  revalidatePath(ticketsPath());

  await setCookieByKey("toast", "Ticket deleted");
  redirect(ticketsPath());
};
