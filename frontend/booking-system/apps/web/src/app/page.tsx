"use client";

import { motion } from "framer-motion";
import { ArrowRight, Scissors } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-charcoal text-cream">
			<div className="absolute inset-0 z-0">
				<Image
					src="/hero_background.png"
					alt="Hero Background"
					fill
					className="object-cover opacity-30"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-charcoal/40" />
				<div className="absolute inset-0 bg-gradient-to-b from-burgundy/10 via-transparent to-transparent" />
			</div>

			<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

			<div className="relative z-10 container mx-auto px-4 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.05 }}
					className="mb-4"
				>
					{/* TODO: Change establishment info */}
					<span className="inline-block px-4 py-1.5 text-xs tracking-[0.3em] uppercase text-gold/80 border border-gold/20 rounded-full bg-gold/5">
						Est. 2024 · Your City
					</span>
				</motion.div>

				<motion.h1
					className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 font-[family-name:var(--font-playfair)]"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.1 }}
				>
					{/* TODO: Change brand name */}
					<span className="text-cream">YOUR</span>{" "}
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-gold">
						BRAND
					</span>
				</motion.h1>

				<motion.div
					className="flex items-center justify-center gap-4 mb-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.4, delay: 0.12 }}
				>
					<div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/50" />
					<Scissors className="h-4 w-4 text-gold/60 rotate-90" strokeWidth={1.5} />
					<div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/50" />
				</motion.div>

				<motion.p
					className="text-lg md:text-xl text-cream/60 max-w-lg mx-auto mb-10 tracking-wide"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.15 }}
				>
					{/* TODO: Change description */}
					Experience premium service. Easy online booking with instant confirmation.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3, delay: 0.2 }}
					className="relative"
				>
					<Link href="/schedule">
						<motion.button
							className="relative group overflow-hidden h-14 px-10 text-base font-semibold rounded-lg bg-gradient-to-r from-gold via-gold-light to-gold text-charcoal border border-gold/50 shadow-2xl shadow-gold/20"
							whileHover={{ scale: 1.03 }}
							whileTap={{ scale: 0.98 }}
							transition={{ type: "spring", stiffness: 400, damping: 17 }}
						>
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
							<span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
								Book Appointment
								<motion.span
									animate={{ x: [0, 4, 0] }}
									transition={{
										duration: 1.5,
										repeat: Infinity,
										ease: "easeInOut",
									}}
								>
									<ArrowRight className="h-5 w-5" />
								</motion.span>
							</span>
						</motion.button>
					</Link>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.4, delay: 0.25 }}
					className="mt-6"
				>
					<Link 
						href="/appointments" 
						className="text-sm text-cream/40 hover:text-gold transition-colors duration-300 tracking-wide"
					>
						Manage existing appointments →
					</Link>
				</motion.div>
			</div>

			<motion.div
				className="absolute bottom-8 left-0 right-0"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.4, delay: 0.3 }}
			>
				{/* TODO: Change footer info */}
				<div className="flex items-center justify-center gap-3 text-xs text-cream/30 tracking-widest uppercase">
					<span>Premium Service</span>
					<span className="h-1 w-1 rounded-full bg-gold/40" />
					<span>Since 2024</span>
					<span className="h-1 w-1 rounded-full bg-gold/40" />
					<span>Your City</span>
				</div>
			</motion.div>

			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
		</div>
	);
}
