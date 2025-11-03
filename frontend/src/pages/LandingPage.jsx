import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const ref = useRef(null);
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });

    // Animate Fyndd scaling + fading with scroll (capped for mobile)
    const scale = useTransform(scrollYProgress, [0, 0.3], [1, 3.5]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    return (
        <div
            className="min-h-[300vh] bg-white text-black overflow-hidden font-sans"
            ref={ref}
        >
            {/* HERO SECTION */}
            <motion.div
                style={{ scale, opacity }}
                className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center text-center px-4"
            >
                <h2 className="text-[60px] sm:text-[90px] md:text-[120px] lg:text-[150px] font-extralight text-gray-900 tracking-[0.2em] leading-tight">
                    FYNDD
                </h2>
                <p className="text-base sm:text-lg md:text-xl font-light text-gray-700 mt-3 tracking-wide">
                    ONE SEARCH DOES IT ALL
                </p>
            </motion.div>

            {/* Spacer for scroll */}
            <div className="h-screen" />

            {/* FEATURES SECTION */}
            <section className="h-screen flex flex-col items-center justify-center space-y-10 px-6 text-center">
                {[
                    { icon: "🛒", title: "Multiple Carts" },
                    { icon: "🤖", title: "AI Discovery" },
                    { icon: "👯", title: "Friendships" },
                    { icon: "💡", title: "Smart Fit" },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2, duration: 0.6 }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-3xl sm:text-4xl">{item.icon}</span>
                        <p className="text-lg sm:text-xl font-medium mt-2 text-gray-800">
                            {item.title}
                        </p>
                    </motion.div>
                ))}
            </section>

            {/* CTA SECTION */}
            <section className="relative z-50 h-screen flex flex-col items-center justify-center px-6 text-center">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-10 py-4 bg-black text-white rounded-full text-lg sm:text-xl font-medium shadow-md cursor-pointer focus:outline-none focus:ring-4 focus:ring-gray-400"
                    onClick={() => navigate("/home")}
                >
                    Try Fyndd Now
                </motion.button>
            </section>
        </div>
    );
}
