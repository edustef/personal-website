# AI Chatbot Design

## Overview

An AI-powered chatbot for the portfolio website that answers questions about Eduard's work and services, and guides visitors toward booking discovery calls.

## Requirements

- Fixed bottom input bar that expands into full chat panel
- AI powered by Vercel AI SDK with OpenAI (swappable)
- Context provided via markdown file about Eduard
- Conversational booking flow → saves to Notion
- Double-booking prevention
- Confirmation email via Resend
- Session-only persistence (ephemeral)
- Minimal & sleek design with glass/blur effects

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Components                         │
├─────────────────────────────────────────────────────────┤
│  <ChatBot />           - Main container, handles expand │
│    <ChatPanel />       - Message list when expanded     │
│    <ChatInput />       - Input bar (always visible)     │
│    <ChatMessage />     - Individual message bubble      │
│    <BookingConfirm />  - Inline booking confirmation    │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Headless Hook                        │
├─────────────────────────────────────────────────────────┤
│  useChatBot()                                           │
│    - messages: Message[]                                │
│    - sendMessage(text) → streams AI response            │
│    - isStreaming: boolean                               │
│    - bookingData: partial booking info collected        │
│    - confirmBooking() → saves to Notion + sends email   │
│    - isBookingPending: boolean                          │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    External Services                    │
├─────────────────────────────────────────────────────────┤
│  /api/chat       - Vercel AI SDK route (streaming)      │
│  /api/booking    - Creates Notion entry + sends email   │
│  Server Actions  - Resend email (existing pattern)      │
└─────────────────────────────────────────────────────────┘
```

## UI States & Interactions

### Collapsed State (default)
- Fixed to bottom of viewport, ~60px height
- Glass effect background with subtle border
- Input placeholder: "Ask me anything..."
- Send button on right (disabled when empty)
- Stays above mobile keyboard using `position: fixed` + `bottom: env(safe-area-inset-bottom)`

### Expanded State (when focused or has messages)
- Expands upward to ~70vh max height
- Messages panel appears above input
- Smooth spring animation on expand/collapse
- Click outside or swipe down to collapse (keeps conversation)
- Backdrop blur on the area behind the panel

### Message Types
- **User message** - Right-aligned, solid accent background
- **AI message** - Left-aligned, glass/translucent background
- **AI streaming** - Same as AI message with typing indicator
- **Booking card** - Special inline component when AI has collected all booking info

### Input Behavior
- Auto-resize textarea (1-4 lines max)
- Send on Enter (Shift+Enter for newline)
- Disabled during streaming
- Send button animates on hover/active

## AI Context & System Prompt

### Context File: `lib/data/ai-context.md`

```markdown
# About Eduard
[Bio, background, values]

# Services
[What you offer, tech stack, specialties]

# Portfolio Highlights
[Key projects, results, technologies used]

# How I Work
[Process, communication style, timelines]

# Pricing
[General approach, value-based, discovery calls]

# Booking a Call
[Availability, what happens on a call, timezone]

# FAQ
[Common questions and answers]
```

### System Prompt Structure

```
You are Eduard's AI assistant on his portfolio website.

<context>
{contents of ai-context.md}
</context>

Your role:
- Answer questions about Eduard's work, services, and experience
- Be helpful, concise, and friendly
- When someone shows interest in working together, guide them toward booking a discovery call
- To book a call, collect: name, email, phone, preferred date/time
- Once you have all booking info, output a special [BOOKING_READY] marker with JSON

Never make up information not in the context.
Keep responses concise (2-3 sentences typical, longer if needed).
```

### Booking Detection

The AI outputs `[BOOKING_READY]{"name":"...", "email":"...", ...}` when ready. The hook parses this and triggers the booking confirmation UI.

## Booking Flow & Notion Integration

### Collection Flow
1. User expresses interest in booking → AI asks for name
2. AI collects: name → email → phone → preferred date/time
3. AI confirms details and outputs `[BOOKING_READY]{...}`
4. Hook parses JSON, shows inline `<BookingConfirm />` card
5. User clicks "Confirm Booking"
6. Mutation fires → Notion API + confirmation email

### Double-Booking Prevention

Before creating the Notion entry, the API route:

1. Query Notion for existing bookings on the requested date/time
   - Filter: `Booking Date` equals requested slot AND `Status` not "Cancelled"
   - If conflict found → return `{ error: "slot_taken" }`

2. On conflict, the hook receives the error and injects a message:
   - AI responds: "That time is already booked. How about [alternative times]?"
   - User picks new time → flow continues

3. Race condition protection via optimistic locking

### API Route: POST /api/booking

```typescript
{
  clientName: string;
  email: string;
  phone: string;
  bookingDate: string;  // ISO format
  notes: string;        // AI-generated summary
}
```

### Notion Payload

```typescript
{
  parent: { database_id: "5c33fc88bfcd413a9f5cd3c6e4557bbd" },
  properties: {
    "Client Name": { title: [{ text: { content: clientName } }] },
    "Email": { email: email },
    "Phone": { phone_number: phone },
    "Status": { select: { name: "Pending" } },
    "Booking Date": { date: { start: bookingDate } },
    "Service Type": { select: { name: "Discovery Call" } },
    "Source": { select: { name: "AI Chat" } },
    "Notes": { rich_text: [{ text: { content: notes } }] },
    "Duration (min)": { number: 30 }
  }
}
```

## File Structure

```
├── app/
│   └── api/
│       ├── chat/
│       │   └── route.ts          # Vercel AI SDK streaming endpoint
│       └── booking/
│           └── route.ts          # Notion create + conflict check
│
├── components/
│   └── chat/
│       ├── chat-bot.tsx          # Main container, expand/collapse
│       ├── chat-panel.tsx        # Messages list with scroll
│       ├── chat-input.tsx        # Input bar + send button
│       ├── chat-message.tsx      # Message bubble (user/ai variants)
│       └── booking-confirm.tsx   # Inline booking card
│
├── hooks/
│   └── use-chat-bot.ts           # Headless logic hook
│
├── lib/
│   ├── actions.ts                # + sendBookingConfirmationEmail
│   └── data/
│       └── ai-context.md         # Context file for the AI
│
└── types/
    └── chat.ts                   # Message, BookingData types
```

## Visual Design

### Color Palette (monochromatic + accent)
- Background: `bg-background/80` with `backdrop-blur-xl`
- Border: `border-border/50` (subtle, 1px)
- User message: Brand accent color, solid
- AI message: `bg-muted/50` with blur
- Send button: Accent color, subtle glow on hover

### Input Bar (collapsed)

```
┌─────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────┐  ┌──┐ │
│  │ Ask me anything...                          │  │ ➤│ │
│  └─────────────────────────────────────────────────────┘  └──┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Expanded Panel
- Max height: `70vh` on desktop, `85vh` on mobile
- Rounded top corners: `rounded-t-2xl`
- Messages scroll with `overflow-y-auto`
- Subtle shadow: `shadow-2xl shadow-black/10`

### Animations (Framer Motion)
- Expand/collapse: spring with `stiffness: 300, damping: 30`
- Messages enter: `fadeIn` + slight `translateY`
- Send button: scale on press, subtle rotation on hover
- Streaming text: no animation (just append)

### Mobile Considerations
- `env(safe-area-inset-bottom)` for notch devices
- Touch: tap outside to collapse
- Keyboard: input stays visible with `visualViewport` API

## Dependencies

```bash
npm install ai @ai-sdk/openai @notionhq/client
```

## Integration

Add `<ChatBot />` to main layout or homepage:
- Renders fixed at bottom, independent of page content
- z-index above other elements but below modals

## Environment Variables

```
OPENAI_API_KEY=
NOTION_API_KEY=
NOTION_BOOKING_DATABASE_ID=5c33fc88bfcd413a9f5cd3c6e4557bbd
```
