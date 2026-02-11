# Booking Page Design

## Overview

Integrate the booking-system into the main portfolio website, adapting the components to match the existing theme and adding i18n support.

## Requirements

- Add booking flow at `/[locale]/schedule`
- Add manage appointments at `/[locale]/appointments`
- Use existing theme variables (replace gold/burgundy with primary/muted)
- Full i18n support via next-intl
- Extend existing Convex schema with booking tables
- Preserve all animations and interactions from booking-system

## Routes

| Route | Purpose |
|-------|---------|
| `/[locale]/(website)/schedule` | Multi-step booking flow |
| `/[locale]/(website)/appointments` | View/cancel existing bookings |

## File Structure

### New Components

```
components/
├── booking/
│   ├── booking-schedule.tsx      # Main booking flow
│   ├── manage-appointments.tsx   # View/cancel bookings
│   ├── weekly-calendar.tsx       # Swipeable month calendar
│   ├── step-indicator.tsx        # Progress steps (date → time → confirm)
│   └── slot-button.tsx           # Time slot selection button
├── ui/
│   ├── input-otp.tsx            # 6-digit OTP input
│   └── alert-dialog.tsx         # Confirmation dialogs
```

### New Lib Files

```
lib/
├── cookies.ts                   # Session cookie utilities
```

### Convex Updates

```
convex/
├── schema.ts                    # + bookings, verificationCodes, sessions tables
├── bookings.ts                  # Booking queries/mutations
└── auth.ts                      # Email verification logic
```

### i18n Updates

```
messages/
├── en.json                      # + booking namespace
└── [other locales].json         # + booking namespace
```

### Route Files

```
app/[locale]/(website)/
├── schedule/
│   └── page.tsx
└── appointments/
    └── page.tsx
```

## Color Mapping

| Booking System | Website Theme | Usage |
|----------------|---------------|-------|
| `bg-charcoal` | `bg-background` | Page background |
| `text-cream` | `text-foreground` | Primary text |
| `text-cream/50` | `text-muted-foreground` | Secondary text |
| `bg-gold` | `bg-primary` | Primary buttons, selected states |
| `text-gold` | `text-primary` | Accent text, icons |
| `border-gold/20` | `border-border` | Subtle borders |
| `bg-burgundy/20` | `bg-muted` | Card backgrounds, highlights |
| `hover:bg-gold/10` | `hover:bg-accent` | Hover states |
| `text-charcoal` | `text-primary-foreground` | Text on primary background |

## Convex Schema

### New Tables

```typescript
bookings: defineTable({
  date: v.string(),           // "YYYY-MM-DD"
  slot: v.string(),           // "10:00"
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
```

### Backend Functions

**convex/bookings.ts:**
- `getAvailability(date)` - Returns booked slots + active user count
- `getFullyBookedDates(startDate, endDate)` - Returns fully booked dates for calendar
- `book(date, slot, email, sessionId?)` - Creates booking with conflict check
- `cancel(bookingId)` - Marks booking as cancelled
- `getMyBookings(email)` - Returns user's confirmed bookings

**convex/auth.ts:**
- `sendCode(email)` - Generates 6-digit code, stores with 10min expiry
- `saveCode(email, code, expiresAt)` - Internal mutation to save code
- `getCode(email)` - Query to get code (for demo display)
- `verifyCode(email, code)` - Validates code, creates 2-hour session
- `validateSession(sessionId)` - Checks if session is valid

## i18n Translations

### Booking Namespace

```json
{
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
      "peopleLooking": "{count} {count, plural, one {person} other {people}} looking"
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
}
```

## UI Components

### InputOTP

- Package: `input-otp`
- 6 slots for verification code
- Styled with theme variables:
  - `bg-input` background
  - `border-border` default border
  - `border-ring` focus border
  - `ring-ring/50` focus ring
  - `text-foreground` text color

### AlertDialog

- Package: `@radix-ui/react-alert-dialog`
- Used for booking cancellation confirmation
- Styled with:
  - `bg-background` overlay
  - `bg-card` content background
  - `border-border` border
  - Primary/destructive button variants

### Cookie Utilities

```typescript
// lib/cookies.ts
const SESSION_COOKIE_NAME = "booking_session";
const SESSION_MAX_AGE = 2 * 60 * 60; // 2 hours

setSessionCookie(sessionId: string): void
getSessionCookie(): string | null
clearSessionCookie(): void
```

## Dependencies

```bash
npm install input-otp @radix-ui/react-alert-dialog
```

## Booking Flow

### Schedule Page Steps

1. **Date Selection** - Monthly calendar with swipe navigation
   - Past dates disabled
   - Fully booked dates disabled
   - Today highlighted

2. **Time Selection** - 8 slots (10:00–17:00)
   - Shows "X people looking" indicator
   - Booked slots shown as struck-through
   - Selected slot highlighted

3. **Verification** - Email + OTP
   - If valid session exists, skip OTP
   - Send 6-digit code to email
   - Demo mode shows code on screen
   - 10-minute code expiry

4. **Confirmation** - Success screen
   - Shows booking details
   - "Add to Google Calendar" button
   - "Done" button returns to home

### Manage Appointments Page

1. **Email Entry** - Or auto-login if session exists
2. **OTP Verification** - Same as booking flow
3. **Bookings List** - Shows confirmed bookings
   - Date, time, status for each
   - Cancel button with confirmation dialog
   - Logout button clears session

## Animations

All animations preserved from booking-system:

- **Step indicator**: Scale + rotate transitions on step change
- **Calendar**: Horizontal swipe with spring physics
- **Slot buttons**: Staggered entrance (30ms delay each)
- **Content transitions**: Fade + slide (x: -20 → 0 → 20)
- **Confirmation**: Scale spring animation for checkmark
- **Booking cards**: Layout animation on delete

## Configuration

Time slots are defined in the component:
```typescript
const slots = [
  "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00",
];
```

Can be moved to environment variable or Convex config later if needed.
