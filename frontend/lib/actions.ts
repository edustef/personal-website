"use server";

import { draftMode } from "next/headers";
import { z } from "zod";
import { Resend } from "resend";
import { writeClient } from "@/sanity/lib/write-client";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters"),
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
    };

    console.log("Form data received:", { email: rawData.email, messageLength: rawData.message?.length });

    const validationResult = contactFormSchema.safeParse(rawData);

    if (!validationResult.success) {
      console.log("Validation failed:", validationResult.error.issues);
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
      };
    }

    const { email, message } = validationResult.data;

    console.log("Validation passed, saving to Sanity and sending email...");

    const createdAt = new Date().toISOString();

    const [sanityResult, resendResult] = await Promise.all([
      writeClient.create({
        _type: "contact",
        email,
        message,
        createdAt,
      }),
      resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL || "Contact Form <onboarding@resend.dev>",
        to: recipientEmail,
        replyTo: email,
        subject: `New contact form submission from ${email}`,
        text: `You received a new message from your contact form:\n\nFrom: ${email}\n\nMessage:\n${message}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      }),
    ]);

    console.log("Successfully saved:", { sanityResult, resendResult });

    return {
      success: true,
      message: "Your message has been sent successfully!",
    };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while sending your message. Please try again later.",
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
