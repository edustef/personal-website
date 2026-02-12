"use client";

import { api } from "@booking-system/backend/convex/_generated/api";
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
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { WeeklyCalendar } from "@/components/weekly-calendar";
import { getSessionCookie, setSessionCookie } from "@/lib/cookies";
import { cn } from "@/lib/utils";

type Step = "date" | "slot" | "verify" | "confirmed";

const STEPS: { key: Step; label: string; icon: React.ElementType }[] = [
	{ key: "date", label: "Date", icon: Calendar },
	{ key: "slot", label: "Time", icon: Clock },
	{ key: "verify", label: "Confirm", icon: ClipboardCheck },
];

function StepIndicator({ currentStep }: { currentStep: Step }) {
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
								isActive && "bg-gradient-to-br from-gold via-gold-light to-gold text-charcoal shadow-lg shadow-gold/30",
								isCompleted && "bg-gold/20 text-gold border border-gold/30",
								!isActive && !isCompleted && "bg-cream/5 text-cream/30 border border-cream/10",
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
							<div className="relative w-8 h-0.5 rounded-full bg-cream/10 overflow-hidden">
								<motion.div
									className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold/60 via-gold to-gold/60"
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

function SlotButton({
	time,
	isSelected,
	isTaken,
	onClick,
}: {
	time: string;
	isSelected: boolean;
	isTaken: boolean;
	onClick: () => void;
}) {
	return (
		<motion.button
			type="button"
			disabled={isTaken}
			onClick={onClick}
			className={cn(
				"relative group w-full h-11 rounded-md font-mono",
				"transition-all duration-200 overflow-hidden",
				"border",
				isSelected && "bg-gold text-charcoal border-gold font-semibold",
				!isSelected && !isTaken && "bg-cream/5 text-cream border-gold/10 hover:bg-gold/10 hover:border-gold/30",
				isTaken && "cursor-not-allowed bg-transparent border-transparent opacity-30",
			)}
			whileHover={!isTaken && !isSelected ? { scale: 1.02 } : {}}
			whileTap={!isTaken ? { scale: 0.98 } : {}}
		>
			{isTaken ? (
				<span className="relative z-10 flex items-center justify-center gap-2 text-cream">
					<span className="line-through">{time}</span>
				</span>
			) : (
				<span className="relative z-10 text-base">{time}</span>
			)}
			{isSelected && (
				<motion.div
					className="absolute inset-0 bg-gold"
					layoutId="selectedSlot"
					transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
				/>
			)}
			{isSelected && (
				<span className="absolute top-2 right-2 z-10 text-charcoal">
					<Check className="w-4 h-4" />
				</span>
			)}
		</motion.button>
	);
}

export function BookingSchedule() {
	const router = useRouter();
	const [step, setStep] = React.useState<Step>("date");
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
		[fullyBookedDates],
	);

	const codeFromDb = useQuery(
		api.auth.getCode,
		codeSent && email ? { email } : "skip",
	);

	const sessionCookie = React.useMemo(() => getSessionCookie(), []);
	const sessionValidation = useQuery(
		api.auth.validateSession,
		sessionCookie ? { sessionId: sessionCookie } : "skip",
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
			toast.error("Failed to send code");
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
			toast.error("Verification failed or slot taken");
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
			toast.error("Booking failed or slot taken");
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

	const slots = [
		"10:00",
		"11:00",
		"12:00",
		"13:00",
		"14:00",
		"15:00",
		"16:00",
		"17:00",
	];

	return (
		<div className="min-h-screen bg-charcoal text-cream pt-16 overflow-x-hidden">
			<div
				className={cn("mx-auto w-full max-w-lg px-4 pt-6 md:px-12 md:pt-12")}
			>
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
							<h2 className="text-2xl font-bold text-cream tracking-tight font-[family-name:var(--font-playfair)]">
								You're All Set
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

				<AnimatePresence>
					{(step === "date" || step === "slot" || step === "verify") && (
						<motion.div
							initial={{ opacity: 1, y: 0 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="relative overflow-hidden rounded-md p-3 border border-gold/30 mb-8 bg-gradient-to-br from-burgundy/30 via-burgundy/20 to-burgundy/30"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
							<div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5" />
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
											className="text-gold text-xs uppercase tracking-wider"
										>
											{step === "date"
												? "Pick a Date"
												: step === "slot"
													? "Pick a Time"
													: "Booking Summary"}
										</motion.div>
									</AnimatePresence>
									<div className="text-cream text-lg font-semibold mt-0.5 flex items-center gap-1">
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
											<span className="text-cream/30 inline-block">Date</span>
										)}
										<span className="text-gold/50">·</span>
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
											<span className="text-cream/30 inline-block">Time</span>
										)}
									</div>
								</div>
								<div className="h-10 w-10 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
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
												<Calendar className="w-4 h-4 text-gold" />
											) : step === "slot" ? (
												<Clock className="w-4 h-4 text-gold" />
											) : (
												<ClipboardCheck className="w-4 h-4 text-gold" />
											)}
										</motion.div>
									</AnimatePresence>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

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
								className="w-full text-cream [&_.text-muted-foreground]:text-cream/40 [&_button:not(:disabled):not([data-selected])]:bg-cream/5 [&_button:not(:disabled):not([data-selected])]:border-gold/10 [&_button:not(:disabled):not([data-selected])]:hover:bg-gold/10 [&_button:not(:disabled):not([data-selected])]:hover:border-gold/30 [&_button[data-selected]]:bg-gold [&_button[data-selected]]:text-charcoal [&_button[data-selected]]:border-gold"
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
									<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20">
										<span className="relative flex h-2 w-2">
											<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
											<span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
										</span>
										<Users className="h-3.5 w-3.5 text-gold" />
										<span className="text-xs text-gold font-medium">
											{availability.activeUsers}{" "}
											{availability.activeUsers === 1 ? "person" : "people"}{" "}
											looking
										</span>
									</div>
								</motion.div>
							)}

							<div className="grid grid-cols-2 gap-2">
								{slots.map((s, i) => (
									<motion.div
										key={s}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: i * 0.03 }}
									>
										<SlotButton
											time={s}
											isSelected={slot === s}
											isTaken={
												availability?.confirmedSlots?.includes(s) ?? false
											}
											onClick={() => handleSlotSelect(s)}
										/>
									</motion.div>
								))}
							</div>

							<Button
								variant="ghost"
								onClick={goBack}
								className="w-full h-12 text-cream/70 hover:text-gold hover:bg-gold/10 border border-gold/10"
							>
								<ChevronLeft className="w-4 h-4 mr-2" />
								Back to Calendar
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
										<h3 className="text-cream font-semibold text-lg">
											Continue with {email}
										</h3>
										<p className="text-cream/50 text-sm mt-1">
											You're signed in. Ready to confirm your booking?
										</p>
									</div>

									<Button
										variant="default"
										size="lg"
										className="w-full h-14 bg-gold text-charcoal hover:bg-gold-light font-semibold"
										onClick={handleContinueWithSession}
										disabled={isLoading}
									>
										{isLoading ? (
											<Loader2 className="w-5 h-5 animate-spin" />
										) : (
											<>
												Confirm Booking
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
										className="w-full h-12 text-cream/70 hover:text-gold hover:bg-gold/10 border border-gold/20"
									>
										Use Different Email
									</Button>
								</motion.div>
							) : !codeSent ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="space-y-4"
								>
									<div className="text-center">
										<h3 className="text-cream font-semibold text-lg">
											Confirm with Email
										</h3>
										<p className="text-cream/50 text-sm mt-1">
											We'll send you a verification code
										</p>
									</div>

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
										onClick={handleSendCode}
										disabled={!email || isLoading}
										className="w-full h-14 bg-gold text-charcoal hover:bg-gold-light font-semibold"
									>
										{isLoading ? (
											<Loader2 className="w-5 h-5 animate-spin" />
										) : (
											<>
												Send Code
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
										<h3 className="text-cream font-semibold text-lg">
											Enter Verification Code
										</h3>
										<p className="text-cream/50 text-sm mt-1">
											Sent to {email}
										</p>
									</div>

									{displayCode && (
										<motion.div
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											className="bg-gradient-to-r from-burgundy/20 to-burgundy/10 border border-gold/30 rounded-md p-3 text-center"
										>
											<p className="text-[10px] text-gold uppercase tracking-wider mb-1">
												Demo Code
											</p>
											<p className="text-2xl font-mono font-bold text-cream tracking-[0.3em]">
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
														className="h-14 w-11 rounded-md bg-cream/5 border-gold/20 text-cream text-xl font-mono first:rounded-l-xl last:rounded-r-xl data-[active]:border-gold/50 data-[active]:ring-gold/20"
													/>
												))}
											</InputOTPGroup>
										</InputOTP>
									</div>

									<Button
										onClick={handleVerifyAndBook}
										disabled={otp.length !== 6 || isLoading}
										className="w-full h-14 bg-gold text-charcoal hover:bg-gold-light font-semibold text-base"
									>
										{isLoading ? (
											<Loader2 className="w-5 h-5 animate-spin" />
										) : (
											<>
												Confirm Booking
												<Check className="w-4 h-4 ml-2" />
											</>
										)}
									</Button>
								</motion.div>
							)}

							<Button
								variant="ghost"
								onClick={goBack}
								className="w-full h-12 text-cream/70 hover:text-gold hover:bg-gold/10 border border-gold/10"
							>
								<ChevronLeft className="w-4 h-4 mr-2" />
								{codeSent ? "Change Email" : "Back"}
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
								<div className="absolute inset-4 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
									<Check
										className="w-10 h-10 text-gold"
										strokeWidth={2.5}
									/>
								</div>
							</motion.div>

							<div className="text-center space-y-1">
								<motion.p
									className="text-cream/50 text-sm"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.2 }}
								>
									Confirmation sent to {email}
								</motion.p>
							</div>

							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className="bg-gradient-to-br from-burgundy/20 to-burgundy/10 rounded-2xl p-4 border border-gold/20"
							>
								<div className="flex items-center gap-4">
									<div className="h-12 w-12 rounded-md bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
										<Calendar className="w-5 h-5 text-gold" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="text-cream font-semibold">
											{date ? format(date, "EEEE, MMMM d") : dateStr}
										</div>
										<div className="text-cream/50 text-sm">
											{slot} · 30 min appointment
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
											d
												.toISOString()
												.replace(/[-:]/g, "")
												.replace(/\.\d{3}/, "");
										const url = new URL(
											"https://calendar.google.com/calendar/render",
										);
										url.searchParams.set("action", "TEMPLATE");
										// TODO: Change appointment title to your business name
										url.searchParams.set(
											"text",
											"Appointment - Your Business",
										);
										url.searchParams.set(
											"dates",
											`${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
										);
										// TODO: Change appointment details
										url.searchParams.set(
											"details",
											"Your appointment booking.",
										);
										window.open(url.toString(), "_blank");
									}}
									variant="ghost"
									className="w-full h-11 text-cream/70 hover:text-gold hover:bg-gold/10 border border-gold/20 rounded-md"
								>
									<CalendarPlus className="w-4 h-4 mr-2" />
									Add to Google Calendar
								</Button>
								<Button
									onClick={() => router.push("/")}
									className="w-full h-11 bg-gold text-charcoal hover:bg-gold-light rounded-md font-semibold"
								>
									Done
								</Button>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
