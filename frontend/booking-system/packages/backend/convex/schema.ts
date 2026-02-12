import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	bookings: defineTable({
		date: v.string(), // YYYY-MM-DD
		slot: v.string(), // e.g. "10:00"
		userEmail: v.string(),
		status: v.union(v.literal("confirmed"), v.literal("cancelled")),
		sessionId: v.optional(v.string()),
	})
		.index("by_date", ["date"])
		.index("by_email", ["userEmail"]),

	verificationCodes: defineTable({
		email: v.string(),
		code: v.string(),
		expiresAt: v.number(),
	}).index("by_email", ["email"]),

	sessions: defineTable({
		sessionId: v.string(),
		email: v.string(),
		expiresAt: v.number(),
	})
		.index("by_sessionId", ["sessionId"])
		.index("by_email", ["email"]),
});
