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

  // Defer cookie reading to after hydration to avoid SSR mismatch
  const [sessionCookie, setSessionCookieState] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    setSessionCookieState(getSessionCookie());
  }, []);

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
