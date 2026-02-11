import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const ALL_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export const getAvailability = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .filter((q) => q.eq(q.field("status"), "confirmed"))
      .collect();

    // Random "people looking" for social proof (13-29 range)
    const activeUsers = Math.floor(Math.random() * 17) + 13;

    const confirmedSlots = bookings.map((b) => b.slot);
    const isFullyBooked = confirmedSlots.length >= ALL_SLOTS.length;

    return {
      confirmedSlots,
      activeUsers,
      isFullyBooked,
    };
  },
});

export const getFullyBookedDates = query({
  args: { startDate: v.string(), endDate: v.string() },
  handler: async (ctx, args) => {
    const allBookings = await ctx.db
      .query("bookings")
      .withIndex("by_date")
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), args.startDate),
          q.lte(q.field("date"), args.endDate),
          q.eq(q.field("status"), "confirmed")
        )
      )
      .collect();

    const bookingsByDate = new Map<string, string[]>();
    for (const booking of allBookings) {
      const existing = bookingsByDate.get(booking.date) || [];
      existing.push(booking.slot);
      bookingsByDate.set(booking.date, existing);
    }

    const fullyBookedDates: string[] = [];
    for (const [date, slots] of bookingsByDate.entries()) {
      if (slots.length >= ALL_SLOTS.length) {
        fullyBookedDates.push(date);
      }
    }

    return fullyBookedDates;
  },
});

export const book = mutation({
  args: {
    date: v.string(),
    slot: v.string(),
    email: v.string(),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("bookings")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .filter((q) =>
        q.and(
          q.eq(q.field("slot"), args.slot),
          q.eq(q.field("status"), "confirmed")
        )
      )
      .first();

    if (existing) {
      throw new Error("Slot already booked");
    }

    const bookingId = await ctx.db.insert("bookings", {
      date: args.date,
      slot: args.slot,
      userEmail: args.email,
      status: "confirmed",
      sessionId: args.sessionId,
    });

    return bookingId;
  },
});

export const cancel = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookingId, { status: "cancelled" });
  },
});

export const getMyBookings = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    if (!args.email) return [];

    return await ctx.db
      .query("bookings")
      .withIndex("by_email", (q) => q.eq("userEmail", args.email))
      .filter((q) => q.eq(q.field("status"), "confirmed"))
      .collect();
  },
});
