# Booking System Integration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate the booking system into the portfolio website with i18n support and theme adaptation.

**Architecture:** Adapt booking-system components to use existing Convex setup (extend schema with 3 new tables), apply website theme variables instead of gold/burgundy colors, add full i18n support via next-intl. Routes at `/[locale]/schedule` and `/[locale]/appointments`.

**Tech Stack:** Next.js 15, Convex, Framer Motion, TailwindCSS 4, next-intl, input-otp, @radix-ui/react-alert-dialog

---

## Task 1: Install Dependencies

**Files:**
- Modify: `frontend/package.json`

**Step 1: Install required packages**

Run:
```bash
cd frontend && npm install input-otp @radix-ui/react-alert-dialog
```

**Step 2: Verify installation**

Run:
```bash
cd frontend && npm list input-otp @radix-ui/react-alert-dialog
```

Expected: Both packages listed with versions

**Step 3: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "chore: add booking system dependencies (input-otp, alert-dialog)"
```

---

## Task 2: Extend Convex Schema

**Files:**
- Modify: `frontend/convex/schema.ts`

**Step 1: Add booking tables to schema**

Replace `frontend/convex/schema.ts` with:

```typescript
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
```

**Step 2: Run Convex to generate types**

Run:
```bash
cd frontend && npx convex dev --once
```

Expected: Schema deployed, types regenerated

**Step 3: Commit**

```bash
git add frontend/convex/schema.ts
git commit -m "feat(convex): add booking, sessions, verificationCodes tables"
```

---

## Task 3: Create Convex Bookings Functions

**Files:**
- Create: `frontend/convex/bookings.ts`

**Step 1: Create bookings.ts**

Create `frontend/convex/bookings.ts`:

```typescript
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
```

**Step 2: Run Convex to deploy**

Run:
```bash
cd frontend && npx convex dev --once
```

Expected: Functions deployed successfully

**Step 3: Commit**

```bash
git add frontend/convex/bookings.ts
git commit -m "feat(convex): add booking queries and mutations"
```

---

## Task 4: Create Convex Auth Functions

**Files:**
- Create: `frontend/convex/auth.ts`

**Step 1: Create auth.ts**

Create `frontend/convex/auth.ts`:

```typescript
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
```

**Step 2: Run Convex to deploy**

Run:
```bash
cd frontend && npx convex dev --once
```

Expected: Functions deployed successfully

**Step 3: Commit**

```bash
git add frontend/convex/auth.ts
git commit -m "feat(convex): add auth functions (sendCode, verifyCode, validateSession)"
```

---

## Task 5: Create Cookie Utilities

**Files:**
- Create: `frontend/lib/cookies.ts`

**Step 1: Create cookies.ts**

Create `frontend/lib/cookies.ts`:

```typescript
const SESSION_COOKIE_NAME = "booking_session";
const SESSION_MAX_AGE = 2 * 60 * 60; // 2 hours in seconds

export function setSessionCookie(sessionId: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=${sessionId}; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax`;
}

export function getSessionCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(^| )${SESSION_COOKIE_NAME}=([^;]+)`)
  );
  return match ? match[2] : null;
}

export function clearSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
}
```

**Step 2: Commit**

```bash
git add frontend/lib/cookies.ts
git commit -m "feat: add session cookie utilities for booking"
```

---

## Task 6: Create InputOTP Component

**Files:**
- Create: `frontend/components/ui/input-otp.tsx`

**Step 1: Create input-otp.tsx**

Create `frontend/components/ui/input-otp.tsx`:

```typescript
"use client";

import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots?.[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm shadow-xs transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
```

**Step 2: Commit**

```bash
git add frontend/components/ui/input-otp.tsx
git commit -m "feat(ui): add InputOTP component"
```

---

## Task 7: Create AlertDialog Component

**Files:**
- Create: `frontend/components/ui/alert-dialog.tsx`

**Step 1: Create alert-dialog.tsx**

Create `frontend/components/ui/alert-dialog.tsx`:

```typescript
"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as React from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants(), className)}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
```

**Step 2: Commit**

```bash
git add frontend/components/ui/alert-dialog.tsx
git commit -m "feat(ui): add AlertDialog component"
```

---

## Task 8: Add i18n Translations

**Files:**
- Modify: `frontend/messages/en.json`
- Modify: `frontend/messages/es.json`
- Modify: `frontend/messages/ro.json`

**Step 1: Add booking namespace to en.json**

Add before the closing `}` of `frontend/messages/en.json`:

```json
  "booking": {
    "steps": {
      "date": "Date",
      "time": "Time",
      "confirm": "Confirm"
    },
    "schedule": {
      "pickDate": "Pick a Date",
      "pickTime": "Pick a Time",
      "bookingSummary": "Booking Summary",
      "date": "Date",
      "time": "Time",
      "backToCalendar": "Back to Calendar",
      "peopleLooking": "{count, plural, one {# person} other {# people}} looking"
    },
    "verify": {
      "confirmWithEmail": "Confirm with Email",
      "sendCodeDescription": "We'll send you a verification code",
      "enterCode": "Enter Verification Code",
      "sentTo": "Sent to {email}",
      "demoCode": "Demo Code",
      "sendCode": "Send Code",
      "verify": "Verify",
      "confirmBooking": "Confirm Booking",
      "continueWith": "Continue with {email}",
      "signedInReady": "You're signed in. Ready to confirm your booking?",
      "useDifferentEmail": "Use Different Email",
      "changeEmail": "Change Email",
      "back": "Back"
    },
    "confirmed": {
      "title": "You're All Set",
      "confirmationSent": "Confirmation sent to {email}",
      "appointment": "30 min appointment",
      "addToCalendar": "Add to Google Calendar",
      "done": "Done"
    },
    "manage": {
      "title": "Manage Bookings",
      "subtitle": "View or cancel your existing appointments",
      "findBookings": "Find Bookings",
      "noBookings": "No active bookings found.",
      "logout": "Log out",
      "cancelBooking": "Cancel Booking",
      "cancelConfirmation": "Are you sure you want to cancel this booking? This action cannot be undone.",
      "keepBooking": "Keep Booking"
    },
    "calendar": {
      "monday": "Mon",
      "tuesday": "Tue",
      "wednesday": "Wed",
      "thursday": "Thu",
      "friday": "Fri",
      "saturday": "Sat",
      "sunday": "Sun"
    },
    "errors": {
      "failedToSendCode": "Failed to send code",
      "invalidCode": "Invalid code",
      "verificationFailed": "Verification failed or slot taken",
      "bookingFailed": "Booking failed or slot taken",
      "failedToCancel": "Failed to cancel",
      "slotTaken": "That time is already booked"
    },
    "success": {
      "bookingCancelled": "Booking cancelled"
    }
  }
```

**Step 2: Add booking namespace to es.json**

Add before the closing `}` of `frontend/messages/es.json`:

```json
  "booking": {
    "steps": {
      "date": "Fecha",
      "time": "Hora",
      "confirm": "Confirmar"
    },
    "schedule": {
      "pickDate": "Elige una Fecha",
      "pickTime": "Elige una Hora",
      "bookingSummary": "Resumen de Reserva",
      "date": "Fecha",
      "time": "Hora",
      "backToCalendar": "Volver al Calendario",
      "peopleLooking": "{count, plural, one {# persona} other {# personas}} mirando"
    },
    "verify": {
      "confirmWithEmail": "Confirmar con Email",
      "sendCodeDescription": "Te enviaremos un código de verificación",
      "enterCode": "Ingresa el Código",
      "sentTo": "Enviado a {email}",
      "demoCode": "Código Demo",
      "sendCode": "Enviar Código",
      "verify": "Verificar",
      "confirmBooking": "Confirmar Reserva",
      "continueWith": "Continuar con {email}",
      "signedInReady": "Has iniciado sesión. ¿Listo para confirmar tu reserva?",
      "useDifferentEmail": "Usar Otro Email",
      "changeEmail": "Cambiar Email",
      "back": "Atrás"
    },
    "confirmed": {
      "title": "¡Todo Listo!",
      "confirmationSent": "Confirmación enviada a {email}",
      "appointment": "Cita de 30 min",
      "addToCalendar": "Agregar a Google Calendar",
      "done": "Listo"
    },
    "manage": {
      "title": "Gestionar Reservas",
      "subtitle": "Ver o cancelar tus citas existentes",
      "findBookings": "Buscar Reservas",
      "noBookings": "No se encontraron reservas activas.",
      "logout": "Cerrar sesión",
      "cancelBooking": "Cancelar Reserva",
      "cancelConfirmation": "¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer.",
      "keepBooking": "Mantener Reserva"
    },
    "calendar": {
      "monday": "Lun",
      "tuesday": "Mar",
      "wednesday": "Mié",
      "thursday": "Jue",
      "friday": "Vie",
      "saturday": "Sáb",
      "sunday": "Dom"
    },
    "errors": {
      "failedToSendCode": "Error al enviar código",
      "invalidCode": "Código inválido",
      "verificationFailed": "Verificación fallida o horario ocupado",
      "bookingFailed": "Reserva fallida o horario ocupado",
      "failedToCancel": "Error al cancelar",
      "slotTaken": "Ese horario ya está reservado"
    },
    "success": {
      "bookingCancelled": "Reserva cancelada"
    }
  }
```

**Step 3: Add booking namespace to ro.json**

Add before the closing `}` of `frontend/messages/ro.json`:

```json
  "booking": {
    "steps": {
      "date": "Data",
      "time": "Ora",
      "confirm": "Confirmă"
    },
    "schedule": {
      "pickDate": "Alege o Dată",
      "pickTime": "Alege o Oră",
      "bookingSummary": "Rezumat Rezervare",
      "date": "Data",
      "time": "Ora",
      "backToCalendar": "Înapoi la Calendar",
      "peopleLooking": "{count, plural, one {# persoană} few {# persoane} other {# persoane}} urmăresc"
    },
    "verify": {
      "confirmWithEmail": "Confirmă cu Email",
      "sendCodeDescription": "Îți vom trimite un cod de verificare",
      "enterCode": "Introdu Codul",
      "sentTo": "Trimis la {email}",
      "demoCode": "Cod Demo",
      "sendCode": "Trimite Codul",
      "verify": "Verifică",
      "confirmBooking": "Confirmă Rezervarea",
      "continueWith": "Continuă cu {email}",
      "signedInReady": "Ești autentificat. Gata să confirmi rezervarea?",
      "useDifferentEmail": "Folosește Alt Email",
      "changeEmail": "Schimbă Email",
      "back": "Înapoi"
    },
    "confirmed": {
      "title": "Totul e Gata!",
      "confirmationSent": "Confirmare trimisă la {email}",
      "appointment": "Întâlnire de 30 min",
      "addToCalendar": "Adaugă în Google Calendar",
      "done": "Gata"
    },
    "manage": {
      "title": "Gestionează Rezervările",
      "subtitle": "Vezi sau anulează întâlnirile tale existente",
      "findBookings": "Caută Rezervări",
      "noBookings": "Nu s-au găsit rezervări active.",
      "logout": "Deconectare",
      "cancelBooking": "Anulează Rezervarea",
      "cancelConfirmation": "Ești sigur că vrei să anulezi această rezervare? Această acțiune nu poate fi anulată.",
      "keepBooking": "Păstrează Rezervarea"
    },
    "calendar": {
      "monday": "Lun",
      "tuesday": "Mar",
      "wednesday": "Mie",
      "thursday": "Joi",
      "friday": "Vin",
      "saturday": "Sâm",
      "sunday": "Dum"
    },
    "errors": {
      "failedToSendCode": "Eroare la trimiterea codului",
      "invalidCode": "Cod invalid",
      "verificationFailed": "Verificare eșuată sau loc ocupat",
      "bookingFailed": "Rezervare eșuată sau loc ocupat",
      "failedToCancel": "Eroare la anulare",
      "slotTaken": "Acea oră este deja rezervată"
    },
    "success": {
      "bookingCancelled": "Rezervare anulată"
    }
  }
```

**Step 4: Commit**

```bash
git add frontend/messages/en.json frontend/messages/es.json frontend/messages/ro.json
git commit -m "feat(i18n): add booking translations for en, es, ro"
```

---

## Task 9: Create WeeklyCalendar Component

**Files:**
- Create: `frontend/components/booking/weekly-calendar.tsx`

**Step 1: Create the component**

Create `frontend/components/booking/weekly-calendar.tsx`:

```typescript
"use client";

import {
  addDays,
  addMonths,
  format,
  getDay,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WeeklyCalendarProps {
  selected: Date | undefined;
  onSelect: (date: Date) => void;
  className?: string;
  isDateDisabled?: (date: Date) => boolean;
  onMonthChange?: (month: Date) => void;
}

function getMonthDays(date: Date) {
  const start = startOfMonth(date);
  const startDay = getDay(start);
  const offset = startDay === 0 ? 6 : startDay - 1;

  const days: (Date | null)[] = [];

  for (let i = 0; i < offset; i++) {
    days.push(null);
  }

  let current = start;
  while (isSameMonth(current, date)) {
    days.push(current);
    current = addDays(current, 1);
  }

  return days;
}

export function WeeklyCalendar({
  selected,
  onSelect,
  className,
  isDateDisabled,
  onMonthChange,
}: WeeklyCalendarProps) {
  const t = useTranslations("booking.calendar");
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [direction, setDirection] = React.useState(0);

  const days = React.useMemo(() => getMonthDays(currentMonth), [currentMonth]);

  const weekdays = [
    t("monday"),
    t("tuesday"),
    t("wednesday"),
    t("thursday"),
    t("friday"),
    t("saturday"),
    t("sunday"),
  ];

  React.useEffect(() => {
    onMonthChange?.(currentMonth);
  }, [currentMonth, onMonthChange]);

  const nextMonth = () => {
    setDirection(1);
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const prevMonth = () => {
    setDirection(-1);
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -50 || info.velocity.x < -300) {
      nextMonth();
    } else if (info.offset.x > 50 || info.velocity.x > 300) {
      prevMonth();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent"
          onClick={prevMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold text-base text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent"
          onClick={nextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-[10px] font-medium text-muted-foreground uppercase py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="relative" style={{ minHeight: 260 }}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentMonth.toISOString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.15 }}
            className="grid grid-cols-7 gap-1.5"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
          >
            {days.map((date, idx) => {
              if (!date) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const isSelected = selected ? isSameDay(date, selected) : false;
              const isToday = isSameDay(date, new Date());
              const isPast = isBefore(date, startOfDay(new Date()));
              const isDisabled = isDateDisabled ? isDateDisabled(date) : false;
              const isUnavailable = isPast || isDisabled;

              return (
                <motion.button
                  type="button"
                  key={date.toISOString()}
                  disabled={isUnavailable}
                  onClick={() => onSelect(date)}
                  data-selected={isSelected || undefined}
                  whileHover={!isUnavailable ? { scale: 1.05 } : {}}
                  whileTap={!isUnavailable ? { scale: 0.95 } : {}}
                  className={cn(
                    "aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-all relative border border-transparent",
                    isSelected &&
                      "bg-primary text-primary-foreground font-semibold border-primary",
                    !isSelected &&
                      !isUnavailable &&
                      "bg-muted/50 hover:bg-accent hover:border-border border-border/50",
                    isUnavailable &&
                      "opacity-30 cursor-not-allowed bg-transparent border-transparent",
                    isToday &&
                      !isSelected &&
                      !isUnavailable &&
                      "ring-2 ring-primary/50 font-semibold"
                  )}
                >
                  {format(date, "d")}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
mkdir -p frontend/components/booking
git add frontend/components/booking/weekly-calendar.tsx
git commit -m "feat(booking): add WeeklyCalendar component with swipe navigation"
```

---

## Task 10: Create SlotButton Component

**Files:**
- Create: `frontend/components/booking/slot-button.tsx`

**Step 1: Create the component**

Create `frontend/components/booking/slot-button.tsx`:

```typescript
"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface SlotButtonProps {
  time: string;
  isSelected: boolean;
  isTaken: boolean;
  onClick: () => void;
}

export function SlotButton({
  time,
  isSelected,
  isTaken,
  onClick,
}: SlotButtonProps) {
  return (
    <motion.button
      type="button"
      disabled={isTaken}
      onClick={onClick}
      className={cn(
        "relative group w-full h-11 rounded-md font-mono",
        "transition-all duration-200 overflow-hidden",
        "border",
        isSelected &&
          "bg-primary text-primary-foreground border-primary font-semibold",
        !isSelected &&
          !isTaken &&
          "bg-muted/50 text-foreground border-border/50 hover:bg-accent hover:border-border",
        isTaken &&
          "cursor-not-allowed bg-transparent border-transparent opacity-30"
      )}
      whileHover={!isTaken && !isSelected ? { scale: 1.02 } : {}}
      whileTap={!isTaken ? { scale: 0.98 } : {}}
    >
      {isTaken ? (
        <span className="relative z-10 flex items-center justify-center gap-2 text-foreground">
          <span className="line-through">{time}</span>
        </span>
      ) : (
        <span className="relative z-10 text-base">{time}</span>
      )}
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-primary"
          layoutId="selectedSlot"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      {isSelected && (
        <span className="absolute top-2 right-2 z-10 text-primary-foreground">
          <Check className="w-4 h-4" />
        </span>
      )}
    </motion.button>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/components/booking/slot-button.tsx
git commit -m "feat(booking): add SlotButton component with selection animation"
```

---

## Task 11: Create StepIndicator Component

**Files:**
- Create: `frontend/components/booking/step-indicator.tsx`

**Step 1: Create the component**

Create `frontend/components/booking/step-indicator.tsx`:

```typescript
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Check, ClipboardCheck, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { cn } from "@/lib/utils";

export type BookingStep = "date" | "slot" | "verify" | "confirmed";

interface StepIndicatorProps {
  currentStep: BookingStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const t = useTranslations("booking.steps");

  const STEPS: { key: BookingStep; label: string; icon: React.ElementType }[] =
    [
      { key: "date", label: t("date"), icon: Calendar },
      { key: "slot", label: t("time"), icon: Clock },
      { key: "verify", label: t("confirm"), icon: ClipboardCheck },
    ];

  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        const Icon = step.icon;

        return (
          <React.Fragment key={step.key}>
            <motion.div
              className={cn(
                "relative flex items-center justify-center overflow-hidden",
                "w-10 h-10 rounded-full",
                isActive &&
                  "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
                isCompleted &&
                  "bg-primary/20 text-primary border border-primary/30",
                !isActive &&
                  !isCompleted &&
                  "bg-muted/50 text-muted-foreground border border-border/50"
              )}
              animate={{
                scale: isActive ? 1.1 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              )}
              <AnimatePresence initial={false}>
                {isCompleted ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon"
                    initial={{ scale: 0.8, opacity: 0, rotate: -90 }}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      opacity: 1,
                      rotate: 0,
                    }}
                    exit={{ scale: 0, opacity: 0, rotate: 90 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            {index < STEPS.length - 1 && (
              <div className="relative w-8 h-0.5 rounded-full bg-border/50 overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{
                    width: isCompleted ? "100%" : "0%",
                  }}
                  transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                    delay: index < currentIndex ? 0.1 : 0,
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
```

**Step 2: Add shimmer animation to globals.css**

Add to `frontend/app/globals.css` (in @theme section or at end):

```css
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

**Step 3: Commit**

```bash
git add frontend/components/booking/step-indicator.tsx frontend/app/globals.css
git commit -m "feat(booking): add StepIndicator component with progress animation"
```

---

## Task 12: Create BookingSchedule Component

**Files:**
- Create: `frontend/components/booking/booking-schedule.tsx`

**Step 1: Create the main component**

Create `frontend/components/booking/booking-schedule.tsx`:

```typescript
"use client";

import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CalendarPlus,
  Check,
  ChevronLeft,
  ClipboardCheck,
  Clock,
  Loader2,
  Mail,
  Send,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { SlotButton } from "@/components/booking/slot-button";
import { StepIndicator, type BookingStep } from "@/components/booking/step-indicator";
import { WeeklyCalendar } from "@/components/booking/weekly-calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { getSessionCookie, setSessionCookie } from "@/lib/cookies";
import { cn } from "@/lib/utils";

const SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export function BookingSchedule() {
  const router = useRouter();
  const t = useTranslations("booking");
  const tErrors = useTranslations("booking.errors");

  const [step, setStep] = React.useState<BookingStep>("date");
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [slot, setSlot] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [codeSent, setCodeSent] = React.useState(false);
  const [mockCode, setMockCode] = React.useState<string | null>(null);
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [hasValidSession, setHasValidSession] = React.useState(false);

  const dateStr = date ? format(date, "yyyy-MM-dd") : "";
  const availability = useQuery(api.bookings.getAvailability, {
    date: dateStr,
  });

  const [calendarMonth, setCalendarMonth] = React.useState(new Date());
  const monthStart = format(startOfMonth(calendarMonth), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(calendarMonth), "yyyy-MM-dd");
  const fullyBookedDates = useQuery(api.bookings.getFullyBookedDates, {
    startDate: monthStart,
    endDate: monthEnd,
  });

  const isDateDisabled = React.useCallback(
    (date: Date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return fullyBookedDates?.includes(dateStr) ?? false;
    },
    [fullyBookedDates]
  );

  const codeFromDb = useQuery(
    api.auth.getCode,
    codeSent && email ? { email } : "skip"
  );

  const sessionCookie = React.useMemo(() => getSessionCookie(), []);
  const sessionValidation = useQuery(
    api.auth.validateSession,
    sessionCookie ? { sessionId: sessionCookie } : "skip"
  );

  React.useEffect(() => {
    if (sessionValidation?.email) {
      setEmail(sessionValidation.email);
      setSessionId(sessionCookie);
      setHasValidSession(true);
    }
  }, [sessionValidation, sessionCookie]);

  const bookMutation = useMutation(api.bookings.book);
  const sendCodeAction = useAction(api.auth.sendCode);
  const verifyCodeMutation = useMutation(api.auth.verifyCode);

  const handleDateSelect = (d: Date | undefined) => {
    setDate(d);
    if (d) setStep("slot");
  };

  const handleSlotSelect = (s: string) => {
    setSlot(s);
    setStep("verify");
  };

  const handleSendCode = async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      const result = await sendCodeAction({ email });
      setMockCode(result.code);
      setCodeSent(true);
    } catch {
      toast.error(tErrors("failedToSendCode"));
    } finally {
      setIsLoading(false);
    }
  };

  const displayCode = mockCode || codeFromDb?.code || null;

  const handleVerifyAndBook = async () => {
    setIsLoading(true);
    try {
      let currentSessionId = sessionId;

      if (!hasValidSession) {
        const result = await verifyCodeMutation({ email, code: otp });
        currentSessionId = result.sessionId;
        setSessionId(currentSessionId);
        setSessionCookie(currentSessionId);
        setHasValidSession(true);
      }

      if (!dateStr || !slot) throw new Error("Missing booking details");

      await bookMutation({
        date: dateStr,
        slot,
        email,
        sessionId: currentSessionId ?? undefined,
      });

      setStep("confirmed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error(tErrors("verificationFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithSession = async () => {
    if (!hasValidSession || !sessionId) return;

    setIsLoading(true);
    try {
      if (!dateStr || !slot) throw new Error("Missing booking details");

      await bookMutation({
        date: dateStr,
        slot,
        email,
        sessionId: sessionId ?? undefined,
      });

      setStep("confirmed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error(tErrors("bookingFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step === "slot") {
      setSlot(null);
      setDate(undefined);
      setStep("date");
    } else if (step === "verify") {
      if (codeSent) {
        setCodeSent(false);
        setOtp("");
        setMockCode(null);
      } else {
        setSlot(null);
        setStep("slot");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-16 overflow-x-hidden">
      <div className={cn("mx-auto w-full max-w-lg px-4 pt-6 md:px-12 md:pt-12")}>
        <AnimatePresence mode="wait">
          {step === "confirmed" && (
            <motion.div
              key="confirmed-title"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-center pb-2"
            >
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                {t("confirmed.title")}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {step !== "confirmed" && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mb-10"
            >
              <StepIndicator currentStep={step} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Bar */}
        <AnimatePresence>
          {(step === "date" || step === "slot" || step === "verify") && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative overflow-hidden rounded-md p-3 border border-border mb-8 bg-muted/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
              <div className="relative flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={
                        step === "date"
                          ? "pick-date"
                          : step === "slot"
                            ? "selected-date"
                            : "booking-summary"
                      }
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className="text-primary text-xs uppercase tracking-wider"
                    >
                      {step === "date"
                        ? t("schedule.pickDate")
                        : step === "slot"
                          ? t("schedule.pickTime")
                          : t("schedule.bookingSummary")}
                    </motion.div>
                  </AnimatePresence>
                  <div className="text-foreground text-lg font-semibold mt-0.5 flex items-center gap-1">
                    {date ? (
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`date-${date.getTime()}`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.2 }}
                          className="inline-block"
                        >
                          {format(date, "EEE, MMM d")}
                        </motion.span>
                      </AnimatePresence>
                    ) : (
                      <span className="text-muted-foreground inline-block">
                        {t("schedule.date")}
                      </span>
                    )}
                    <span className="text-muted-foreground">·</span>
                    {slot ? (
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`slot-${slot}`}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.2 }}
                          className="inline-block"
                        >
                          {slot}
                        </motion.span>
                      </AnimatePresence>
                    ) : (
                      <span className="text-muted-foreground inline-block">
                        {t("schedule.time")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={
                        step === "date"
                          ? "calendar-icon"
                          : step === "slot"
                            ? "clock-icon"
                            : "clipboard-icon"
                      }
                      initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      {step === "date" ? (
                        <Calendar className="w-4 h-4 text-primary" />
                      ) : step === "slot" ? (
                        <Clock className="w-4 h-4 text-primary" />
                      ) : (
                        <ClipboardCheck className="w-4 h-4 text-primary" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === "date" && (
            <motion.div
              key="step-date"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="mt-2"
            >
              <WeeklyCalendar
                selected={date}
                onSelect={handleDateSelect}
                isDateDisabled={isDateDisabled}
                onMonthChange={setCalendarMonth}
              />
            </motion.div>
          )}

          {step === "slot" && (
            <motion.div
              key="step-slot"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {availability && availability.activeUsers > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 py-2"
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs text-primary font-medium">
                      {t("schedule.peopleLooking", {
                        count: availability.activeUsers,
                      })}
                    </span>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {SLOTS.map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <SlotButton
                      time={s}
                      isSelected={slot === s}
                      isTaken={availability?.confirmedSlots?.includes(s) ?? false}
                      onClick={() => handleSlotSelect(s)}
                    />
                  </motion.div>
                ))}
              </div>

              <Button
                variant="ghost"
                onClick={goBack}
                className="w-full h-12 text-muted-foreground hover:text-primary hover:bg-accent border border-border"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                {t("schedule.backToCalendar")}
              </Button>
            </motion.div>
          )}

          {step === "verify" && (
            <motion.div
              key="step-verify"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {hasValidSession && email ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <h3 className="text-foreground font-semibold text-lg">
                      {t("verify.continueWith", { email })}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {t("verify.signedInReady")}
                    </p>
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    className="w-full h-14 font-semibold"
                    onClick={handleContinueWithSession}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {t("verify.confirmBooking")}
                        <Check className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setHasValidSession(false);
                      setEmail("");
                      setSessionId(null);
                    }}
                    className="w-full h-12 text-muted-foreground hover:text-primary hover:bg-accent border border-border"
                  >
                    {t("verify.useDifferentEmail")}
                  </Button>
                </motion.div>
              ) : !codeSent ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <h3 className="text-foreground font-semibold text-lg">
                      {t("verify.confirmWithEmail")}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {t("verify.sendCodeDescription")}
                    </p>
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && email && !isLoading) {
                          handleSendCode();
                        }
                      }}
                      className="h-14 pl-12 text-lg"
                    />
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleSendCode}
                    disabled={!email || isLoading}
                    className="w-full h-14 font-semibold"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {t("verify.sendCode")}
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="text-center">
                    <h3 className="text-foreground font-semibold text-lg">
                      {t("verify.enterCode")}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {t("verify.sentTo", { email })}
                    </p>
                  </div>

                  {displayCode && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-muted border border-border rounded-md p-3 text-center"
                    >
                      <p className="text-[10px] text-primary uppercase tracking-wider mb-1">
                        {t("verify.demoCode")}
                      </p>
                      <p className="text-2xl font-mono font-bold text-foreground tracking-[0.3em]">
                        {displayCode}
                      </p>
                    </motion.div>
                  )}

                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                      onComplete={() => {
                        if (!isLoading) handleVerifyAndBook();
                      }}
                    >
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="h-14 w-11 rounded-md bg-muted border-border text-foreground text-xl font-mono first:rounded-l-xl last:rounded-r-xl data-[active]:border-primary data-[active]:ring-primary/20"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button
                    onClick={handleVerifyAndBook}
                    disabled={otp.length !== 6 || isLoading}
                    className="w-full h-14 font-semibold text-base"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {t("verify.confirmBooking")}
                        <Check className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              <Button
                variant="ghost"
                onClick={goBack}
                className="w-full h-12 text-muted-foreground hover:text-primary hover:bg-accent border border-border"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                {codeSent ? t("verify.changeEmail") : t("verify.back")}
              </Button>
            </motion.div>
          )}

          {step === "confirmed" && (
            <motion.div
              key="step-confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <motion.div
                className="relative mx-auto w-28 h-28"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
              >
                <div className="absolute inset-4 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <Check className="w-10 h-10 text-primary" strokeWidth={2.5} />
                </div>
              </motion.div>

              <div className="text-center space-y-1">
                <motion.p
                  className="text-muted-foreground text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {t("confirmed.confirmationSent", { email })}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-muted rounded-2xl p-4 border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground font-semibold">
                      {date ? format(date, "EEEE, MMMM d") : dateStr}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {slot} · {t("confirmed.appointment")}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Button
                  onClick={() => {
                    if (!date || !slot) return;
                    const [hours, minutes] = slot.split(":").map(Number);
                    const startDate = new Date(date);
                    startDate.setHours(hours, minutes, 0, 0);
                    const endDate = new Date(startDate);
                    endDate.setMinutes(endDate.getMinutes() + 30);
                    const formatGoogleDate = (d: Date) =>
                      d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
                    const url = new URL(
                      "https://calendar.google.com/calendar/render"
                    );
                    url.searchParams.set("action", "TEMPLATE");
                    url.searchParams.set("text", "Discovery Call - Eduard");
                    url.searchParams.set(
                      "dates",
                      `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`
                    );
                    url.searchParams.set(
                      "details",
                      "Your scheduled discovery call."
                    );
                    window.open(url.toString(), "_blank");
                  }}
                  variant="ghost"
                  className="w-full h-11 text-muted-foreground hover:text-primary hover:bg-accent border border-border rounded-md"
                >
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  {t("confirmed.addToCalendar")}
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  className="w-full h-11 rounded-md font-semibold"
                >
                  {t("confirmed.done")}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/components/booking/booking-schedule.tsx
git commit -m "feat(booking): add BookingSchedule component with full flow"
```

---

## Task 13: Create ManageAppointments Component

**Files:**
- Create: `frontend/components/booking/manage-appointments.tsx`

**Step 1: Create the component**

Create `frontend/components/booking/manage-appointments.tsx`:

```typescript
"use client";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAction, useMutation, useQuery } from "convex/react";
import { format, parse } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Check, Loader2, Mail, Send, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  clearSessionCookie,
  getSessionCookie,
  setSessionCookie,
} from "@/lib/cookies";
import { cn } from "@/lib/utils";

type Step = "email" | "verify" | "list" | "loading";

export function ManageAppointments() {
  const t = useTranslations("booking");
  const tErrors = useTranslations("booking.errors");
  const tSuccess = useTranslations("booking.success");

  const sessionCookie = React.useMemo(() => getSessionCookie(), []);
  const hasSessionCookie = !!sessionCookie;

  const [step, setStep] = React.useState<Step>(
    hasSessionCookie ? "loading" : "email"
  );
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [mockCode, setMockCode] = React.useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [bookingToDelete, setBookingToDelete] =
    React.useState<Id<"bookings"> | null>(null);

  const sessionValidation = useQuery(
    api.auth.validateSession,
    sessionCookie ? { sessionId: sessionCookie } : "skip"
  );

  React.useEffect(() => {
    if (sessionCookie) {
      if (sessionValidation === undefined) {
        setStep("loading");
      } else if (sessionValidation?.email) {
        setEmail(sessionValidation.email);
        setSessionId(sessionCookie);
        setStep("list");
      } else {
        setStep("email");
      }
    } else {
      setStep("email");
    }
  }, [sessionValidation, sessionCookie]);

  const myBookings = useQuery(
    api.bookings.getMyBookings,
    email && sessionId ? { email } : "skip"
  );
  const sendCodeAction = useAction(api.auth.sendCode);
  const verifyCodeMutation = useMutation(api.auth.verifyCode);
  const cancelBookingMutation = useMutation(api.bookings.cancel);

  const handleSendCode = async () => {
    setIsLoading(true);
    try {
      const result = await sendCodeAction({ email });
      setMockCode(result.code);
      setStep("verify");
    } catch {
      toast.error(tErrors("failedToSendCode"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const res = await verifyCodeMutation({ email, code: otp });
      setSessionId(res.sessionId);
      setSessionCookie(res.sessionId);
      setStep("list");
    } catch {
      toast.error(tErrors("invalidCode"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = (id: Id<"bookings">) => {
    setBookingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToDelete) return;
    try {
      await cancelBookingMutation({ bookingId: bookingToDelete });
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
      toast.success(tSuccess("bookingCancelled"));
    } catch {
      toast.error(tErrors("failedToCancel"));
    }
  };

  const reset = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setSessionId(null);
    setMockCode(null);
    clearSessionCookie();
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <div
        className={cn("mx-auto w-full max-w-2xl px-4 pt-6 md:px-12 md:py-12")}
      >
        <div className="pb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              {t("manage.title")}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {t("manage.subtitle")}
            </p>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {step === "loading" && (
            <motion.div
              key="step-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center p-6"
            >
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </motion.div>
          )}

          {step === "email" && (
            <motion.div
              key="step-email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email && !isLoading) {
                      handleSendCode();
                    }
                  }}
                  className="h-14 pl-12 text-lg"
                />
              </div>
              <Button
                variant="default"
                size="lg"
                className="w-full h-14 font-semibold"
                onClick={handleSendCode}
                disabled={!email || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {t("manage.findBookings")}
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {step === "verify" && (
            <motion.div
              key="step-verify"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h3 className="text-foreground font-semibold text-lg">
                  {t("verify.enterCode")}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {t("verify.sentTo", { email })}
                </p>
              </div>

              {mockCode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-muted border border-border rounded-md p-3 text-center"
                >
                  <p className="text-[10px] text-primary uppercase tracking-wider mb-1">
                    {t("verify.demoCode")}
                  </p>
                  <p className="text-2xl font-mono font-bold text-foreground tracking-[0.3em]">
                    {mockCode}
                  </p>
                </motion.div>
              )}

              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  onComplete={() => {
                    if (!isLoading) handleVerify();
                  }}
                >
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="h-14 w-11 rounded-md bg-muted border-border text-foreground text-xl font-mono first:rounded-l-xl last:rounded-r-xl data-[active]:border-primary data-[active]:ring-primary/20"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                variant="default"
                size="lg"
                className="w-full h-14 font-semibold"
                onClick={handleVerify}
                disabled={otp.length !== 6 || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {t("verify.verify")}
                    <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {step === "list" && (
            <motion.div
              key="step-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {myBookings === undefined ? (
                <div className="flex justify-center p-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : myBookings.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 text-base">
                  {t("manage.noBookings")}
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {myBookings.map((b, index: number) => (
                    <motion.div
                      key={b._id}
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{
                        opacity: 0,
                        x: -20,
                        scale: 0.9,
                        transition: { duration: 0.2 },
                      }}
                      transition={{
                        delay: index * 0.05,
                        layout: { duration: 0.3, ease: "easeOut" },
                      }}
                      className="bg-muted rounded-2xl p-4 border border-border flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-foreground font-semibold">
                            {format(
                              parse(b.date, "yyyy-MM-dd", new Date()),
                              "EEEE, MMMM d, yyyy"
                            )}{" "}
                            at {b.slot}
                          </div>
                          <div className="text-muted-foreground text-sm capitalize">
                            {b.status}
                          </div>
                        </div>
                      </div>
                      {b.status === "confirmed" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-10 w-10 shrink-0"
                          onClick={() => handleCancelClick(b._id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              <Button
                variant="ghost"
                onClick={() => {
                  reset();
                }}
                className="w-full h-12 text-muted-foreground hover:text-primary hover:bg-accent border border-border rounded-md"
              >
                {t("manage.logout")}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-background border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-foreground">
                {t("manage.cancelBooking")}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                {t("manage.cancelConfirmation")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setBookingToDelete(null);
                }}
                className="bg-muted border-border text-foreground hover:bg-accent hover:text-primary"
              >
                {t("manage.keepBooking")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelConfirm}
                className="bg-destructive hover:bg-destructive/90 text-white"
              >
                {t("manage.cancelBooking")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add frontend/components/booking/manage-appointments.tsx
git commit -m "feat(booking): add ManageAppointments component"
```

---

## Task 14: Create Schedule Page Route

**Files:**
- Create: `frontend/app/[locale]/(website)/schedule/page.tsx`

**Step 1: Create the page**

Create directory and file `frontend/app/[locale]/(website)/schedule/page.tsx`:

```typescript
import { BookingSchedule } from "@/components/booking/booking-schedule";

export default function SchedulePage() {
  return <BookingSchedule />;
}
```

**Step 2: Commit**

```bash
mkdir -p frontend/app/\[locale\]/\(website\)/schedule
git add frontend/app/\[locale\]/\(website\)/schedule/page.tsx
git commit -m "feat(routes): add /[locale]/schedule page"
```

---

## Task 15: Create Appointments Page Route

**Files:**
- Create: `frontend/app/[locale]/(website)/appointments/page.tsx`

**Step 1: Create the page**

Create directory and file `frontend/app/[locale]/(website)/appointments/page.tsx`:

```typescript
import { ManageAppointments } from "@/components/booking/manage-appointments";

export default function AppointmentsPage() {
  return <ManageAppointments />;
}
```

**Step 2: Commit**

```bash
mkdir -p frontend/app/\[locale\]/\(website\)/appointments
git add frontend/app/\[locale\]/\(website\)/appointments/page.tsx
git commit -m "feat(routes): add /[locale]/appointments page"
```

---

## Task 16: Create Index Exports

**Files:**
- Create: `frontend/components/booking/index.ts`

**Step 1: Create barrel export**

Create `frontend/components/booking/index.ts`:

```typescript
export { BookingSchedule } from "./booking-schedule";
export { ManageAppointments } from "./manage-appointments";
export { SlotButton } from "./slot-button";
export { StepIndicator, type BookingStep } from "./step-indicator";
export { WeeklyCalendar } from "./weekly-calendar";
```

**Step 2: Commit**

```bash
git add frontend/components/booking/index.ts
git commit -m "chore(booking): add barrel exports"
```

---

## Task 17: Verify Build

**Step 1: Run TypeScript check**

Run:
```bash
cd frontend && npx tsc --noEmit
```

Expected: No errors

**Step 2: Run build**

Run:
```bash
cd frontend && npm run build
```

Expected: Build completes successfully

**Step 3: Test locally**

Run:
```bash
cd frontend && npm run dev
```

Visit:
- `http://localhost:3000/en/schedule` - Should show booking flow
- `http://localhost:3000/en/appointments` - Should show manage appointments

**Step 4: Commit any fixes if needed**

---

## Summary

This plan creates:

1. **Convex Backend** - 3 new tables (bookings, sessions, verificationCodes) with queries/mutations
2. **UI Components** - InputOTP, AlertDialog adapted to theme
3. **Booking Components** - WeeklyCalendar, SlotButton, StepIndicator, BookingSchedule, ManageAppointments
4. **i18n** - Full translations in en, es, ro
5. **Routes** - `/[locale]/schedule` and `/[locale]/appointments`

All components use the website's theme variables (`--primary`, `--background`, `--foreground`, etc.) instead of the original gold/burgundy colors. Animations are preserved from the source booking-system.
