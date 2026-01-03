"use server";

import { normalizeMessage, sanitizeForHtml } from "@/lib/security";
import { checkRateLimit } from "@vercel/firewall";
import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const rateLimitRuleId =
  process.env.VERCEL_CONTACT_RATE_LIMIT_ID || "contact-form";

const contactFormSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .trim()
    .refine(
      (value) => !/[\r\n]/.test(value),
      "Please enter a valid email address"
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
  recipientEmail: string
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
      for (const issue of validationResult.error.issues) {
        const field = issue.path[0] as "email" | "message";
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field]?.push(issue.message);
      }

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

    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL || "Contact Form <onboarding@resend.dev>",
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
    });

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

export async function sendProjectInquiryEmail(
  inquiryData: {
    email: string;
    isTech?: boolean;
    projectType?: string[];
    targetAudience?: string;
    projectPurpose?: string;
    features?: string[];
    currentStatus?: string;
    currentLink?: string;
    budgetRange?: string;
    timeline?: string;
    businessContext?: string;
    successCriteria?: string;
    bookCall?: boolean;
  },
  recipientEmail?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const email = recipientEmail || process.env.RESEND_FROM_EMAIL;

    if (!email) {
      console.warn("No recipient email configured for project inquiries");
      return {
        success: false,
        message: "Email recipient not configured",
      };
    }

    const headerList = await headers();

    const { rateLimited } = await checkRateLimit(rateLimitRuleId, {
      headers: headerList,
    });

    if (rateLimited) {
      return {
        success: false,
        message: "Too many submissions. Please wait and try again.",
      };
    }

    const normalizedEmail = inquiryData.email.toLowerCase();

    const formatArray = (arr?: string[]) =>
      arr && arr.length > 0 ? arr.join(", ") : "Not specified";

    const formatText = (text?: string) =>
      text?.trim() ? sanitizeForHtml(text.trim()) : "Not provided";

    const emailContent = {
      isTech:
        inquiryData.isTech === true
          ? "Yes, technical"
          : inquiryData.isTech === false
            ? "No, non-technical"
            : "Not specified",
      projectType: formatArray(inquiryData.projectType),
      targetAudience: inquiryData.targetAudience || "Not specified",
      projectPurpose: inquiryData.projectPurpose || "Not specified",
      features: formatArray(inquiryData.features),
      currentStatus: inquiryData.currentStatus || "Not specified",
      currentLink: inquiryData.currentLink || "Not provided",
      budgetRange: inquiryData.budgetRange || "Not specified",
      timeline: inquiryData.timeline || "Not specified",
      businessContext: formatText(inquiryData.businessContext),
      successCriteria: formatText(inquiryData.successCriteria),
      bookCall: inquiryData.bookCall ? "Yes" : "No",
    };

    const textContent = `New Project Inquiry from ${normalizedEmail}

Technical Background: ${emailContent.isTech}

Project Type: ${emailContent.projectType}
Target Audience: ${emailContent.targetAudience}
Project Purpose: ${emailContent.projectPurpose}

Features Needed: ${emailContent.features}

Current Status: ${emailContent.currentStatus}
Current Link: ${emailContent.currentLink}

Budget Range: ${emailContent.budgetRange}
Timeline: ${emailContent.timeline}

Business Context:
${inquiryData.businessContext || "Not provided"}

Success Criteria:
${inquiryData.successCriteria || "Not provided"}

Book a Call: ${emailContent.bookCall}`;

    const htmlContent = `
      <h2>New Project Inquiry</h2>
      <p><strong>From:</strong> ${sanitizeForHtml(normalizedEmail)}</p>
      
      <h3>Technical Background</h3>
      <p>${sanitizeForHtml(emailContent.isTech)}</p>
      
      <h3>Project Details</h3>
      <p><strong>Project Type:</strong> ${sanitizeForHtml(emailContent.projectType)}</p>
      <p><strong>Target Audience:</strong> ${sanitizeForHtml(emailContent.targetAudience)}</p>
      <p><strong>Project Purpose:</strong> ${sanitizeForHtml(emailContent.projectPurpose)}</p>
      
      <h3>Features Needed</h3>
      <p>${sanitizeForHtml(emailContent.features)}</p>
      
      <h3>Current State</h3>
      <p><strong>Status:</strong> ${sanitizeForHtml(emailContent.currentStatus)}</p>
      <p><strong>Current Link:</strong> ${inquiryData.currentLink ? `<a href="${sanitizeForHtml(inquiryData.currentLink)}">${sanitizeForHtml(inquiryData.currentLink)}</a>` : "Not provided"}</p>
      
      <h3>Budget & Timeline</h3>
      <p><strong>Budget Range:</strong> ${sanitizeForHtml(emailContent.budgetRange)}</p>
      <p><strong>Timeline:</strong> ${sanitizeForHtml(emailContent.timeline)}</p>
      
      <h3>Business Context</h3>
      <p>${emailContent.businessContext.replace(/\n/g, "<br>")}</p>
      
      <h3>Success Criteria</h3>
      <p>${emailContent.successCriteria.replace(/\n/g, "<br>")}</p>
      
      <h3>Additional Information</h3>
      <p><strong>Book a Call:</strong> ${emailContent.bookCall}</p>
    `;

    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL || "Contact Form <onboarding@resend.dev>",
      to: email,
      replyTo: normalizedEmail,
      subject: `New project inquiry from ${normalizedEmail}`,
      text: textContent,
      html: htmlContent,
    });

    return {
      success: true,
      message: "Project inquiry email sent successfully",
    };
  } catch (error) {
    console.error("Error sending project inquiry email:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An error occurred while sending the email. Please try again later.",
    };
  }
}
