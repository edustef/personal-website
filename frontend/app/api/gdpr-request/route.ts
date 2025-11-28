import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { checkRateLimit } from "@vercel/firewall";
import { headers } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const rateLimitRuleId =
  process.env.VERCEL_CONTACT_RATE_LIMIT_ID || "contact-form";

const gdprRequestSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .trim()
    .refine(
      (value) => !/[\r\n]/.test(value),
      "Please enter a valid email address",
    ),
  requestType: z.enum(["access", "deletion"]),
  message: z.string().trim().max(2000, "Message must be less than 2000 characters").optional(),
});

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}

const convexClient = new ConvexHttpClient(convexUrl);

export async function POST(request: NextRequest) {
  try {
    const headerList = await headers();
    const { rateLimited } = await checkRateLimit(rateLimitRuleId, {
      headers: headerList,
    });

    if (rateLimited) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const validatedData = gdprRequestSchema.parse(body);

    const normalizedEmail = validatedData.email.toLowerCase();

    if (validatedData.requestType === "deletion") {
      const deleted = await convexClient.mutation(
        api.projectInquiries.deleteByEmail,
        { email: normalizedEmail },
      );

      if (deleted) {
        const emailContent = `A GDPR data deletion request has been processed for: ${normalizedEmail}`;
        
        await resend.emails.send({
          from:
            process.env.RESEND_FROM_EMAIL || "Contact Form <onboarding@resend.dev>",
          to: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          subject: `GDPR Deletion Request - ${normalizedEmail}`,
          text: emailContent,
        });

        return NextResponse.json({
          success: true,
          message: "Your data has been deleted successfully.",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "No data found for this email address.",
        });
      }
    } else if (validatedData.requestType === "access") {
      const data = await convexClient.query(
        api.projectInquiries.getByEmail,
        { email: normalizedEmail },
      );

      if (!data || data.length === 0) {
        return NextResponse.json({
          success: false,
          message: "No data found for this email address.",
        });
      }

      const emailContent = `GDPR Data Access Request\n\nEmail: ${normalizedEmail}\n\nData:\n${JSON.stringify(data, null, 2)}`;

      await resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL || "Contact Form <onboarding@resend.dev>",
        to: normalizedEmail,
        subject: "Your Personal Data - GDPR Access Request",
        text: emailContent,
      });

      return NextResponse.json({
        success: true,
        message: "Your data has been sent to your email address.",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid request type." },
      { status: 400 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request data.",
          errors: error.errors,
        },
        { status: 400 },
      );
    }

    console.error("GDPR request error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred processing your request." },
      { status: 500 },
    );
  }
}

