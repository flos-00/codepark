import { describe, it, expect, beforeEach, vi } from "vitest";
import { upsertTicket } from "./upsert-ticket";
import { ActionState } from "@/components/form/utils/to-action-state";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("REDIRECT");
  }),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock prisma
vi.mock("../../../../../lib/prisma", () => ({
  prisma: {
    ticket: {
      upsert: vi.fn(),
    },
  },
}));

// Mock cookies action
vi.mock("@/actions/cookies", () => ({
  setCookieByKey: vi.fn(),
}));

// Mock currency utils
vi.mock("@/utils/currency", () => ({
  toCent: vi.fn((amount: number) => Math.round(amount * 100)),
}));

import { prisma } from "../../../../../lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { setCookieByKey } from "@/actions/cookies";
import { toCent } from "@/utils/currency";

describe("upsertTicket", () => {
  let mockActionState: ActionState;

  beforeEach(() => {
    vi.clearAllMocks();
    mockActionState = {
      status: "SUCCESS",
      message: "",
      payload: new FormData(),
      fieldErrors: {},
      timestamp: Date.now(),
    };
  });

  describe("Validation", () => {
    it("should reject empty title", async () => {
      const formData = new FormData();
      formData.append("title", "");
      formData.append("content", "Test Content");
      formData.append("deadline", "2026-03-25");
      formData.append("bounty", "100");

      const result = await upsertTicket(undefined, mockActionState, formData);

      expect(result.status).toBe("ERROR");
      expect(result.fieldErrors?.title).toBeDefined();
    });

    it("should reject title exceeding 100 characters", async () => {
      const formData = new FormData();
      formData.append("title", "a".repeat(101));
      formData.append("content", "Test Content");
      formData.append("deadline", "2026-03-25");
      formData.append("bounty", "100");

      const result = await upsertTicket(undefined, mockActionState, formData);

      expect(result.status).toBe("ERROR");
      expect(result.fieldErrors?.title).toBeDefined();
    });

    it("should reject empty content", async () => {
      const formData = new FormData();
      formData.append("title", "Test Title");
      formData.append("content", "");
      formData.append("deadline", "2026-03-25");
      formData.append("bounty", "100");

      const result = await upsertTicket(undefined, mockActionState, formData);

      expect(result.status).toBe("ERROR");
      expect(result.fieldErrors?.content).toBeDefined();
    });

    it("should reject content exceeding 1000 characters", async () => {
      const formData = new FormData();
      formData.append("title", "Test Title");
      formData.append("content", "a".repeat(1001));
      formData.append("deadline", "2026-03-25");
      formData.append("bounty", "100");

      const result = await upsertTicket(undefined, mockActionState, formData);

      expect(result.status).toBe("ERROR");
      expect(result.fieldErrors?.content).toBeDefined();
    });

    it("should reject invalid date format", async () => {
      const formData = new FormData();
      formData.append("title", "Test Title");
      formData.append("content", "Test Content");
      formData.append("deadline", "25-03-2026");
      formData.append("bounty", "100");

      const result = await upsertTicket(undefined, mockActionState, formData);

      expect(result.status).toBe("ERROR");
      expect(result.fieldErrors?.deadline).toBeDefined();
    });

    it("should reject empty deadline", async () => {
      const formData = new FormData();
      formData.append("title", "Test Title");
      formData.append("content", "Test Content");
      formData.append("deadline", "");
      formData.append("bounty", "100");

      const result = await upsertTicket(undefined, mockActionState, formData);

      expect(result.status).toBe("ERROR");
      expect(result.fieldErrors?.deadline).toBeDefined();
    });

    it("should reject non-positive bounty", async () => {
      const formData = new FormData();
      formData.append("title", "Test Title");
      formData.append("content", "Test Content");
      formData.append("deadline", "2026-03-25");
      formData.append("bounty", "0");

      const result = await upsertTicket(undefined, mockActionState, formData);

      expect(result.status).toBe("ERROR");
      expect(result.fieldErrors?.bounty).toBeDefined();
    });

    it("should reject negative bounty", async () => {
      const formData = new FormData();
      formData.append("title", "Test Title");
      formData.append("content", "Test Content");
      formData.append("deadline", "2026-03-25");
      formData.append("bounty", "-50");

      const result = await upsertTicket(undefined, mockActionState, formData);

      expect(result.status).toBe("ERROR");
      expect(result.fieldErrors?.bounty).toBeDefined();
    });
  });

  describe("Create Ticket", () => {
    it("should create a new ticket with valid data", async () => {
      const formData = new FormData();
      formData.append("title", "New Ticket");
      formData.append("content", "New Content");
      formData.append("deadline", "2026-04-15");
      formData.append("bounty", "250");

      vi.mocked(prisma.ticket.upsert).mockResolvedValueOnce({
        id: "new-id",
        title: "New Ticket",
        content: "New Content",
        deadline: "2026-04-15",
        bounty: 25000,
        status: "OPEN",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      try {
        await upsertTicket(undefined, mockActionState, formData);
      } catch {
        // Expected to not redirect on create
      }

      expect(prisma.ticket.upsert).toHaveBeenCalledWith({
        where: { id: "" },
        update: {
          title: "New Ticket",
          content: "New Content",
          deadline: "2026-04-15",
          bounty: 25000,
        },
        create: {
          title: "New Ticket",
          content: "New Content",
          deadline: "2026-04-15",
          bounty: 25000,
        },
      });

      expect(revalidatePath).toHaveBeenCalled();
    });

    it("should convert bounty to cents on create", async () => {
      const formData = new FormData();
      formData.append("title", "New Ticket");
      formData.append("content", "New Content");
      formData.append("deadline", "2026-04-15");
      formData.append("bounty", "99.99");

      vi.mocked(prisma.ticket.upsert).mockResolvedValueOnce({
        id: "new-id",
        title: "New Ticket",
        content: "New Content",
        deadline: "2026-04-15",
        bounty: 9999,
        status: "OPEN",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      try {
        await upsertTicket(undefined, mockActionState, formData);
      } catch {
        // Expected behavior
      }

      expect(toCent).toHaveBeenCalledWith(99.99);
      const callArgs = vi.mocked(prisma.ticket.upsert).mock.calls[0][0];
      expect(callArgs.create.bounty).toBe(9999);
    });
  });

  describe("Update Ticket", () => {
    it("should update existing ticket with valid data", async () => {
      const formData = new FormData();
      formData.append("title", "Updated Ticket");
      formData.append("content", "Updated Content");
      formData.append("deadline", "2026-05-20");
      formData.append("bounty", "500");

      vi.mocked(prisma.ticket.upsert).mockResolvedValueOnce({
        id: "ticket-1",
        title: "Updated Ticket",
        content: "Updated Content",
        deadline: "2026-05-20",
        bounty: 50000,
        status: "OPEN",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(redirect).mockImplementationOnce(() => {
        throw new Error("REDIRECT");
      });

      try {
        const result = await upsertTicket(
          "ticket-1",
          mockActionState,
          formData,
        );
        expect(result).toBeDefined();
      } catch (error) {
        // redirect is expected
      }

      expect(prisma.ticket.upsert).toHaveBeenCalledWith({
        where: { id: "ticket-1" },
        update: {
          title: "Updated Ticket",
          content: "Updated Content",
          deadline: "2026-05-20",
          bounty: 50000,
        },
        create: {
          title: "Updated Ticket",
          content: "Updated Content",
          deadline: "2026-05-20",
          bounty: 50000,
        },
      });
    });

    it("should set cookie and redirect on successful update", async () => {
      const formData = new FormData();
      formData.append("title", "Updated Ticket");
      formData.append("content", "Updated Content");
      formData.append("deadline", "2026-05-20");
      formData.append("bounty", "500");

      vi.mocked(prisma.ticket.upsert).mockResolvedValueOnce({
        id: "ticket-1",
        title: "Updated Ticket",
        content: "Updated Content",
        deadline: "2026-05-20",
        bounty: 50000,
        status: "OPEN",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      try {
        await upsertTicket("ticket-1", mockActionState, formData);
      } catch (error) {
        // redirect throws
      }

      expect(setCookieByKey).toHaveBeenCalledWith("toast", "Ticket updated");
      expect(redirect).toHaveBeenCalled();
    });

    it("should not set cookie on create", async () => {
      const formData = new FormData();
      formData.append("title", "New Ticket");
      formData.append("content", "New Content");
      formData.append("deadline", "2026-04-15");
      formData.append("bounty", "250");

      vi.mocked(prisma.ticket.upsert).mockResolvedValueOnce({
        id: "new-id",
        title: "New Ticket",
        content: "New Content",
        deadline: "2026-04-15",
        bounty: 25000,
        status: "OPEN",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      try {
        await upsertTicket(undefined, mockActionState, formData);
      } catch {
        // Expected
      }

      expect(setCookieByKey).not.toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors", async () => {
      const formData = new FormData();
      formData.append("title", "Test Title");
      formData.append("content", "Test Content");
      formData.append("deadline", "2026-03-25");
      formData.append("bounty", "100");

      const dbError = new Error("Database connection failed");
      vi.mocked(prisma.ticket.upsert).mockRejectedValueOnce(dbError);

      const result = await upsertTicket(undefined, mockActionState, formData);

      expect(result.status).toBe("ERROR");
      expect(result.message).toBeDefined();
    });

    it("should preserve form data on validation error", async () => {
      const formData = new FormData();
      formData.append("title", "Test Title");
      formData.append("content", "");
      formData.append("deadline", "2026-03-25");
      formData.append("bounty", "100");

      const result = await upsertTicket(undefined, mockActionState, formData);

      expect(result.status).toBe("ERROR");
      expect(result.payload).toBeDefined();
    });
  });
});
