import { Suspense } from "react";
import { Heading } from "@/components/heading";
import { TicketList } from "../features/ticket/components/ticket-list";
import { Spinner } from "@/components/spinner";
import { CardCompact } from "@/components/card-compact";
import { TicketUpsertForm } from "../features/ticket/components/ticket-upsert-form";

const TicketsPage = () => {
  return (
    <>
      <div className="flex-1 flex flex-col gap-y-8">
        <Heading title="Tickets" description="All your tickets at one place" />
        <CardCompact
          title="Create Ticket"
          description="A new Ticket will be created"
          content={<TicketUpsertForm />}
        />
        <Suspense fallback={<Spinner />}>
          <TicketList />
        </Suspense>
      </div>
    </>
  );
};

export default TicketsPage;
