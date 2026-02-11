import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projectInquiries: defineTable({
    // User Identification
    userId: v.optional(v.string()), // For logged-in users or tracking ID

    // Progress Tracking
    currentStep: v.number(),
    isTech: v.optional(v.boolean()),
    status: v.string(), // "in_progress" | "submitted"

    // Slide 1 - Goal & Project Type
    projectType: v.optional(v.array(v.string())),

    // Slide 2 - Audience & Purpose
    targetAudience: v.optional(v.string()),
    projectPurpose: v.optional(v.string()), // Use string to allow "Other" or specific enums

    // Slide 3 - Features & Functionality
    features: v.optional(v.array(v.string())),

    // Slide 4 - Current State
    currentStatus: v.optional(v.string()),
    existingResources: v.optional(v.array(v.string())),
    currentLink: v.optional(v.string()),

    // Slide 5 - Budget & Timeline
    budgetRange: v.optional(v.string()),
    timeline: v.optional(v.string()),

    // Slide 6 - Business Context
    businessContext: v.optional(v.string()),
    successCriteria: v.optional(v.string()),

    // Slide 7 - Contact
    email: v.optional(v.string()),
    bookCall: v.optional(v.boolean()),

    // Meta
    updatedAt: v.number(),
  }),

  // Booking System Tables
  bookings: defineTable({
    date: v.string(), // "YYYY-MM-DD"
    slot: v.string(), // "10:00"
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
