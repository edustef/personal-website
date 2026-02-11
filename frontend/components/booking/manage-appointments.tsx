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

  // Defer cookie reading to after hydration to avoid SSR mismatch
  const [sessionCookie, setSessionCookieState] = React.useState<string | null>(
    null
  );
  const [isHydrated, setIsHydrated] = React.useState(false);

  const [step, setStep] = React.useState<Step>("loading");
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [bookingToDelete, setBookingToDelete] =
    React.useState<Id<"bookings"> | null>(null);

  // Read cookie after hydration
  React.useEffect(() => {
    const cookie = getSessionCookie();
    setSessionCookieState(cookie);
    setIsHydrated(true);
  }, []);

  const sessionValidation = useQuery(
    api.auth.validateSession,
    sessionCookie ? { sessionId: sessionCookie } : "skip"
  );

  React.useEffect(() => {
    if (!isHydrated) return;

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
  }, [sessionValidation, sessionCookie, isHydrated]);

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
      await sendCodeAction({ email });
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
