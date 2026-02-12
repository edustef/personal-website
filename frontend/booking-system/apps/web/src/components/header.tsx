"use client";
import { CalendarCheck } from "lucide-react";
import Link from "next/link";

export default function Header() {
	return (
		<header className="fixed z-10 inset-x-0 top-0 h-16">
			<div className="flex items-center justify-between px-4 md:px-6 h-full max-w-7xl mx-auto">
				<Link 
					href="/" 
					className="flex items-center gap-1.5 group"
					aria-label="Home"
				>
					{/* TODO: Change brand name */}
					<span className="text-base font-semibold text-cream tracking-wide font-[family-name:var(--font-playfair)]">
						YOUR
					</span>
					<span className="text-base font-light text-gold/80 tracking-wide font-[family-name:var(--font-playfair)]">
						Brand
					</span>
				</Link>

				<Link 
					href="/appointments"
					className="flex items-center gap-2 text-sm text-cream/50 hover:text-gold transition-colors"
				>
					<CalendarCheck className="h-4 w-4" aria-hidden="true" />
					<span className="hidden sm:inline">My Appointments</span>
				</Link>
			</div>
		</header>
	);
}
