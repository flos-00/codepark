import Link from "next/link";
import clsx from "clsx";
import { ticketPath, ticketEditPath } from "@/paths";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Ticket } from "@/lib/generated/prisma/client";
import { TICKET_ICONS } from "@/app/features/ticket/constants";
import {
  LucideSquareArrowOutUpRight,
  LucideTrash,
  LucidePencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteTicket } from "../queries/actions/delete-ticket";
import { fromCent } from "@/utils/currency";

type TiketItemProps = {
  ticket: Ticket;
  isDetail?: boolean;
};

const TicketItem = ({ ticket, isDetail }: TiketItemProps) => {
  const detailButton = (
    <Button variant={"outline"} asChild size={"icon"}>
      <Link prefetch href={ticketPath(ticket.id)}>
        <LucideSquareArrowOutUpRight className="h-4 w-4" />
      </Link>
    </Button>
  );

  const deleteButton = (
    <form action={deleteTicket.bind(null, ticket.id) as unknown as string}>
      <Button variant={"outline"} size={"icon"}>
        <LucideTrash></LucideTrash>
      </Button>
    </form>
  );

  const editButton = (
    <Button variant={"outline"} asChild size={"icon"}>
      <Link href={ticketEditPath(ticket.id)}>
        <LucidePencil className="h-4 w-4" />
      </Link>
    </Button>
  );

  return (
    <div
      className={clsx("flex w-full gap-x-1 ", {
        "max-w-[580]": isDetail,
        "max-w-[420px]": !isDetail,
      })}
    >
      <Card key={ticket.id} className="w-full">
        <CardHeader>
          <CardTitle className="flex gap-x-2">
            <span>{TICKET_ICONS[ticket.status]}</span>
            <span className="truncate text-xl">{ticket.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span
            className={clsx("whitespace-break-spaces", {
              "line-clamp-3": !isDetail,
            })}
          >
            {ticket.content}
          </span>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">{ticket.deadline}</p>
          <p className="text-sm text-muted-foreground">
            € {fromCent(ticket.bounty)}
          </p>
        </CardFooter>
      </Card>
      <div className="flex flex-col gap-y-2">
        {isDetail ? (
          <>
            {deleteButton}
            {editButton}
          </>
        ) : (
          detailButton
        )}
      </div>
    </div>
  );
};

export { TicketItem };
