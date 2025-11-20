"use server";

import { draftMode, headers } from "next/headers";
import { z } from "zod";
import { checkRateLimit } from "@vercel/firewall";
import { Resend } from "resend";
import { writeClient } from "@/sanity/lib/write-client";
import { normalizeMessage, sanitizeForHtml } from "@/lib/security";

const resend = new Resend(process.env.RESEND_API_KEY);

const rateLimitRuleId =
  process.env.VERCEL_CONTACT_RATE_LIMIT_ID || "contact-form";

const contactFormSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .trim()
    .refine(
      (value) => !/[\r\n]/.test(value),
      "Please enter a valid email address",
    ),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters"),
  website: z.string().max(0, "Invalid submission"),
});

export type ContactFormState =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      errors?: {
        email?: string[];
        message?: string[];
      };
      message?: string;
      data?: {
        email?: string;
        message?: string;
      };
    };

export async function submitContactForm(
  prevState: ContactFormState | null,
  formData: FormData,
  recipientEmail: string,
): Promise<ContactFormState> {
  try {
    const rawData = {
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      website: (formData.get("website") as string) || "",
    };

    const headerList = await headers();

    const { rateLimited } = await checkRateLimit(rateLimitRuleId, {
      headers: headerList,
    });

    if (rateLimited) {
      return {
        success: false,
        message: "Too many submissions. Please wait and try again.",
        data: {
          email: rawData.email || "",
          message: rawData.message || "",
        },
      };
    }

    const validationResult = contactFormSchema.safeParse(rawData);

    if (!validationResult.success) {
      const errors: { email?: string[]; message?: string[] } = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as "email" | "message";
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field]!.push(issue.message);
      });

      return {
        success: false,
        errors,
        data: {
          email: rawData.email || "",
          message: rawData.message || "",
        },
      };
    }

    const { email, message } = validationResult.data;
    const normalizedEmail = email.toLowerCase();
    const cleanedMessage = normalizeMessage(message);
    const safeMessage = sanitizeForHtml(cleanedMessage);

    const createdAt = new Date().toISOString();

    await Promise.all([
      writeClient.create({
        _type: "contact",
        email: normalizedEmail,
        message: cleanedMessage,
        createdAt,
      }),
      resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL ||
          "Contact Form <onboarding@resend.dev>",
        to: recipientEmail,
        replyTo: normalizedEmail,
        subject: `New contact form submission from ${normalizedEmail}`,
        text: `You received a new message from your contact form:\n\nFrom: ${normalizedEmail}\n\nMessage:\n${cleanedMessage}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${sanitizeForHtml(normalizedEmail)}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage.replace(/\n/g, "<br>")}</p>
        `,
      }),
    ]);

    return {
      success: true,
      message: "Your message has been sent successfully!",
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    const rawData = {
      email: (formData.get("email") as string) || "",
      message: (formData.get("message") as string) || "",
    };
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while sending your message. Please try again later.",
      data: {
        email: rawData.email,
        message: rawData.message,
      },
    };
  }
}

export async function disableDraftMode() {
  "use server";
  await Promise.allSettled([
    (await draftMode()).disable(),
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]);
}
