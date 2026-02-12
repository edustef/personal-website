"use client";

import { api } from "@booking-system/backend/convex/_generated/api";
import type { Id } from "@booking-system/backend/convex/_generated/dataModel";
import { useAction, useMutation, useQuery } from "convex/react";
import { format, parse } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Check, Loader2, Mail, Send, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
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
import {
	clearSessionCookie,
	getSessionCookie,
	setSessionCookie,
} from "@/lib/cookies";
import { cn } from "@/lib/utils";

type Step = "email" | "verify" | "list" | "loading";

export function ManageAppointments() {
	const sessionCookie = React.useMemo(() => getSessionCookie(), []);
	const hasSessionCookie = !!sessionCookie;

	const [step, setStep] = React.useState<Step>(
		hasSessionCookie ? "loading" : "email",
	);
	const [email, setEmail] = React.useState("");
	const [otp, setOtp] = React.useState("");
	const [sessionId, setSessionId] = React.useState<string | null>(null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [mockCode, setMockCode] = React.useState<string | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
	const [bookingToDelete, setBookingToDelete] = React.useState<Id<"bookings"> | null>(null);

	const sessionValidation = useQuery(
		api.auth.validateSession,
		sessionCookie ? { sessionId: sessionCookie } : "skip",
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
		email && sessionId ? { email } : "skip",
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
			toast.error("Failed to send code");
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
			toast.error("Invalid code");
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
			toast.success("Booking cancelled");
		} catch {
			toast.error("Failed to cancel");
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
		<div className="min-h-screen bg-charcoal text-cream pt-16">
			<div
				className={cn("mx-auto w-full max-w-2xl px-4 pt-6 md:px-12 md:py-12")}
			>
				<div className="pb-8">
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center"
					>
						<h2 className="text-2xl font-bold text-cream tracking-tight font-[family-name:var(--font-playfair)]">
							Manage Bookings
						</h2>
						<p className="text-cream/50 text-sm mt-1">
							View or cancel your existing appointments
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
								<Loader2 className="h-6 w-6 animate-spin text-gold" />
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
									<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
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
										className="h-14 pl-12 bg-cream/5 border-gold/20 text-cream placeholder:text-cream/30 rounded-md focus:border-gold/50 focus:ring-gold/20 text-lg md:text-xl"
									/>
								</div>
								<Button
									variant="default"
									size="lg"
									className="w-full h-14 bg-gold text-charcoal hover:bg-gold-light font-semibold"
									onClick={handleSendCode}
									disabled={!email || isLoading}
								>
									{isLoading ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										<>
											Find Bookings
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
									<h3 className="text-cream font-semibold text-lg">
										Enter Verification Code
									</h3>
									<p className="text-cream/50 text-sm mt-1">Sent to {email}</p>
								</div>

								{mockCode && (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										className="bg-gradient-to-r from-burgundy/20 to-burgundy/10 border border-gold/30 rounded-md p-3 text-center"
									>
										<p className="text-[10px] text-gold uppercase tracking-wider mb-1">
											Demo Code
										</p>
										<p className="text-2xl font-mono font-bold text-cream tracking-[0.3em]">
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
													className="h-14 w-11 rounded-md bg-cream/5 border-gold/20 text-cream text-xl font-mono first:rounded-l-xl last:rounded-r-xl data-[active]:border-gold/50 data-[active]:ring-gold/20"
												/>
											))}
										</InputOTPGroup>
									</InputOTP>
								</div>

								<Button
									variant="default"
									size="lg"
									className="w-full h-14 bg-gold text-charcoal hover:bg-gold-light font-semibold"
									onClick={handleVerify}
									disabled={otp.length !== 6 || isLoading}
								>
									{isLoading ? (
										<Loader2 className="w-5 h-5 animate-spin" />
									) : (
										<>
											Verify
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
										<Loader2 className="h-6 w-6 animate-spin text-gold" />
									</div>
								) : myBookings.length === 0 ? (
									<div className="text-center text-cream/50 py-8 text-base">
										No active bookings found.
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
													transition: { duration: 0.2 }
												}}
												transition={{ 
													delay: index * 0.05,
													layout: { duration: 0.3, ease: "easeOut" }
												}}
												className="bg-gradient-to-br from-burgundy/20 to-burgundy/10 rounded-2xl p-4 border border-gold/20 flex items-center justify-between"
											>
												<div className="flex items-center gap-4 flex-1 min-w-0">
													<div className="h-12 w-12 rounded-md bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
														<Calendar className="w-5 h-5 text-gold" />
													</div>
													<div className="flex-1 min-w-0">
														<div className="text-cream font-semibold">
															{format(
																parse(b.date, "yyyy-MM-dd", new Date()),
																"EEEE, MMMM d, yyyy",
															)}{" "}
															at {b.slot}
														</div>
														<div className="text-cream/50 text-sm capitalize">
															{b.status}
														</div>
													</div>
												</div>
												{b.status === "confirmed" && (
													<Button
														size="icon"
														variant="ghost"
														className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-10 w-10 shrink-0"
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
									className="w-full h-12 text-cream/70 hover:text-gold hover:bg-gold/10 border border-gold/20 rounded-md"
								>
									Log out
								</Button>
							</motion.div>
						)}
					</AnimatePresence>

					<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
						<AlertDialogContent className="bg-charcoal border-gold/20">
							<AlertDialogHeader>
								<AlertDialogTitle className="text-cream">
									Cancel Booking
								</AlertDialogTitle>
								<AlertDialogDescription className="text-cream/70">
									Are you sure you want to cancel this booking? This action cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel 
									onClick={() => {
										setDeleteDialogOpen(false);
										setBookingToDelete(null);
									}}
									className="bg-cream/5 border-gold/20 text-cream hover:bg-gold/10 hover:text-gold"
								>
									Keep Booking
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleCancelConfirm}
									className="bg-red-500 hover:bg-red-600 text-white"
								>
									Cancel Booking
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
			</div>
		</div>
	);
}
