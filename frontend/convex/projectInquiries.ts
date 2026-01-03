import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getInquiry = query({
  args: { _id: v.optional(v.id("projectInquiries")) },
  handler: async (ctx, args) => {
    const inquiry = args._id ? await ctx.db.get(args._id) : null;

    if (!inquiry) {
      return null;
    }
    const { _creationTime, updatedAt, ...dataToReturn } = inquiry;

    return dataToReturn;
  },
});

export const saveProgress = mutation({
  args: {
    _id: v.optional(v.id("projectInquiries")),
    currentStep: v.optional(v.number()),
    isTech: v.optional(v.boolean()),
    projectType: v.optional(v.array(v.string())),
    targetAudience: v.optional(v.string()),
    projectPurpose: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    currentStatus: v.optional(v.string()),
    existingResources: v.optional(v.array(v.string())),
    currentLink: v.optional(v.string()),
    budgetRange: v.optional(v.string()),
    timeline: v.optional(v.string()),
    businessContext: v.optional(v.string()),
    successCriteria: v.optional(v.string()),
    email: v.optional(v.string()),
    bookCall: v.optional(v.boolean()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { _id, ...updates } = args;

    const existing = args._id ? await ctx.db.get(args._id) : null;

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...updates,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    const newId = await ctx.db.insert("projectInquiries", {
      currentStep: updates.currentStep ?? 0,
      status: updates.status ?? "in_progress",
      updatedAt: Date.now(),
      ...updates,
    });
    return newId;
  },
});

export const submitInquiry = mutation({
  args: {
    _id: v.optional(v.id("projectInquiries")),
    email: v.string(),
    bookCall: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = args._id ? await ctx.db.get(args._id) : null;

    if (!existing) {
      throw new Error("Inquiry not found");
    }

    await ctx.db.patch(existing._id, {
      email: args.email,
      bookCall: args.bookCall,
      status: "submitted",
    });
  },
});
