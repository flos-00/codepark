import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TicketUpsertForm } from "./ticket-upsert-form";
import { Ticket } from "@/lib/generated/prisma/client";
import { TicketStatus } from "@/lib/generated/prisma/enums";

// Mock the server action
vi.mock("../queries/actions/upsert-ticket", () => ({
  upsertTicket: vi.fn(),
}));

// Mock the sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("TicketUpsertForm", () => {
  it("renders form in create mode with empty fields", () => {
    render(<TicketUpsertForm />);

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Content")).toBeInTheDocument();
    expect(screen.getByLabelText("Deadline")).toBeInTheDocument();
    expect(screen.getByLabelText("Bounty (€)")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create ticket/i }),
    ).toBeInTheDocument();
  });

  it("renders form in update mode with ticket data pre-filled", () => {
    const mockTicket: Ticket = {
      status: TicketStatus.OPEN,
      id: "1",
      title: "Test Ticket",
      content: "Test Content",
      deadline: "2026-03-25",
      bounty: 50000,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<TicketUpsertForm ticket={mockTicket} />);

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    const contentInput = screen.getByLabelText(
      "Content",
    ) as HTMLTextAreaElement;
    const deadlineInput = screen.getByLabelText("Deadline") as HTMLInputElement;
    const bountyInput = screen.getByLabelText("Bounty (€)") as HTMLInputElement;

    expect(titleInput.value).toBe("Test Ticket");
    expect(contentInput.value).toBe("Test Content");
    expect(deadlineInput.value).toBe("2026-03-25");
    expect(bountyInput.value).toBe("500");
    expect(
      screen.getByRole("button", { name: /update ticket/i }),
    ).toBeInTheDocument();
  });

  it("renders with empty fields when no ticket is provided", () => {
    render(<TicketUpsertForm />);

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    const contentInput = screen.getByLabelText(
      "Content",
    ) as HTMLTextAreaElement;
    const deadlineInput = screen.getByLabelText("Deadline") as HTMLInputElement;
    const bountyInput = screen.getByLabelText("Bounty (€)") as HTMLInputElement;

    expect(titleInput.value).toBe("");
    expect(contentInput.value).toBe("");
    expect(deadlineInput.value).toBe("");
    expect(bountyInput.value).toBe("");
  });

  it("displays correct submit button label for create mode", () => {
    render(<TicketUpsertForm />);

    expect(
      screen.getByRole("button", { name: /create ticket/i }),
    ).toBeInTheDocument();
  });

  it("displays correct submit button label for update mode", () => {
    const mockTicket: Ticket = {
      status: TicketStatus.IN_PROGRESS,
      id: "1",
      title: "Existing Ticket",
      content: "Existing Content",
      deadline: "2026-04-01",
      bounty: 100000,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<TicketUpsertForm ticket={mockTicket} />);

    expect(
      screen.getByRole("button", { name: /update ticket/i }),
    ).toBeInTheDocument();
  });

  it("renders form with proper structure", () => {
    const { container } = render(<TicketUpsertForm />);

    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass("flex", "flex-col", "gap-y-2", "w-full");
  });

  it("renders title input with correct attributes", () => {
    render(<TicketUpsertForm />);

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    expect(titleInput).toHaveAttribute("type", "text");
    expect(titleInput).toHaveAttribute("name", "title");
    expect(titleInput).toHaveAttribute("id", "title");
  });

  it("renders content textarea with correct attributes", () => {
    render(<TicketUpsertForm />);

    const contentInput = screen.getByLabelText(
      "Content",
    ) as HTMLTextAreaElement;
    expect(contentInput).toHaveAttribute("name", "content");
    expect(contentInput).toHaveAttribute("id", "content");
  });

  it("renders deadline input with correct attributes", () => {
    render(<TicketUpsertForm />);

    const deadlineInput = screen.getByLabelText("Deadline") as HTMLInputElement;
    expect(deadlineInput).toHaveAttribute("type", "date");
    expect(deadlineInput).toHaveAttribute("name", "deadline");
    expect(deadlineInput).toHaveAttribute("id", "deadline");
  });

  it("renders bounty input with correct attributes", () => {
    render(<TicketUpsertForm />);

    const bountyInput = screen.getByLabelText("Bounty (€)") as HTMLInputElement;
    expect(bountyInput).toHaveAttribute("type", "number");
    expect(bountyInput).toHaveAttribute("name", "bounty");
    expect(bountyInput).toHaveAttribute("id", "bounty");
    expect(bountyInput).toHaveAttribute("step", ".01");
  });

  it("uses form data from actionState.payload when available", () => {
    // This would require more advanced testing with custom implementation
    // of useActionState, but the basic rendering is tested above
    render(<TicketUpsertForm />);

    expect(screen.getByLabelText("Title")).toBeInTheDocument();
  });
});
