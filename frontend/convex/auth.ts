import { v } from "convex/values";
import { Resend } from "resend";
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

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Booking <onboarding@resend.dev>",
      to: args.email,
      subject: "Your verification code",
      text: `Your verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
      html: `
        <h2>Your Verification Code</h2>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 24px 0;">${code}</p>
        <p>This code will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this code, you can safely ignore this email.</p>
      `,
    });
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
