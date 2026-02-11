import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";

export const sendCode = action({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await ctx.runMutation(internal.auth.saveCode, {
      email: args.email,
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins
    });

    // TODO: Send email using Resend when ready
    console.log(`Verification code for ${args.email}: ${code}`);
    return { code };
  },
});

export const saveCode = internalMutation({
  args: { email: v.string(), code: v.string(), expiresAt: v.number() },
  handler: async (ctx, args) => {
    // Invalidate old codes
    const existing = await ctx.db
      .query("verificationCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();

    for (const doc of existing) {
      await ctx.db.delete(doc._id);
    }

    await ctx.db.insert("verificationCodes", {
      email: args.email,
      code: args.code,
      expiresAt: args.expiresAt,
    });
  },
});

export const getCode = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("verificationCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .order("desc")
      .first();

    if (!record) return null;
    if (Date.now() > record.expiresAt) return null;

    return { code: record.code, expiresAt: record.expiresAt };
  },
});

export const verifyCode = mutation({
  args: { email: v.string(), code: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("verificationCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("code"), args.code))
      .first();

    if (!record) throw new Error("Invalid code");
    if (Date.now() > record.expiresAt) throw new Error("Code expired");

    await ctx.db.delete(record._id);

    const sessionId = crypto.randomUUID();
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours

    // Invalidate existing sessions for this email
    const existingSessions = await ctx.db
      .query("sessions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();

    for (const session of existingSessions) {
      await ctx.db.delete(session._id);
    }

    await ctx.db.insert("sessions", {
      sessionId,
      email: args.email,
      expiresAt,
    });

    return { sessionId, email: args.email };
  },
});

export const validateSession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!session) return null;
    if (Date.now() > session.expiresAt) return null;

    return { email: session.email, expiresAt: session.expiresAt };
  },
});
