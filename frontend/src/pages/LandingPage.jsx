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
    const color = useTransform(scrollYProgress, [0, 0.25], ["#111111", "#FFFFFF"]);

    return (
        <div
            className="min-h-[300vh] bg-white text-black overflow-hidden font-sans"
            ref={ref}
        >
            {/* HERO SECTION */}
            <motion.div
                style={{ scale, opacity }}
                className="fixed top-0 left-0 w-full h-screen flex flex-col justify-center text-center px-4"
            >
                {/* FYNDD Title */}
                <motion.h2
                    className="text-[60px] sm:text-[90px] md:text-[120px] lg:text-[150px] font-extralight text-gray-900 tracking-[0.2em] leading-tight"
                    style={{
                        position: "relative",
                        left: "12px", // 👈 controls horizontal offset for FYNDD
                        top: "-10px",
                        color,// 👈 controls vertical offset
                    }}
                >
                    FYNDD
                </motion.h2>

                {/* Tagline */}
                <motion.p
                    className="text-base sm:text-lg md:text-xl font-light text-gray-700 tracking-wide"
                    style={{
                        position: "relative",
                        left: "4px", // 👈 move tagline independently (e.g. slightly left)
                        top: "-4px",
                        color,// 👈 controls vertical spacing from FYNDD
                    }}
                >
                    ONE SEARCH DOES IT ALL
                </motion.p>
            </motion.div>

            {/* Spacer for scroll */}
            <div className="h-screen" />

            {/* FEATURES SECTION */}
            <section className="relative z-10 bg-white py-16 px-6 sm:px-8 md:px-16">
                <div className="max-w-6xl mx-auto space-y-10 sm:space-y-20 md:space-y-24">

                {[
                        {
                            title: "Trusted By The Best",
                            desc: "Partnered with top global and indie brands to bring you authentic experiences.",
                            img: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2025-11-03+at+17.45.07.jpeg",
                        },
                        {
                            title: "Search Like You Speak",
                            desc: "Just type what’s on your mind — Fyndd understands intent, not just keywords.",
                            video: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Video+2025-11-03+at+17.08.22+(online-video-cutter.com).mp4",
                        },
                        {
                            title: "Try It. Virtually. Perfectly.",
                            desc: "Meet Patron-AI, your personal try-on assistant powered by real-time vision AI.",
                            img: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/AI-Virtual-Try-On.webp",
                        },
                        {
                            title: "One Account. Infinite Carts.",
                            desc: "Keep your carts private, hidden, or public — your space, your control.",
                            video: "https://fyndd-storage.s3.ap-south-1.amazonaws.com/Screen+Recording+2025-11-03+at+10.36.29%E2%80%AFPM+(online-video-cutter.com).mp4",
                        },
                        {
                            title: "Shop Together. Stay Inspired.",
                            desc: "Join friends, creators, and shoppers in a vibrant social shopping network.",
                            img: ""

                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className={`flex flex-col md:flex-row ${
                                i % 2 === 1 ? "md:flex-row-reverse" : ""
                            } items-center gap-10 md:gap-20`}
                        >
                            {/* MEDIA (Video or Image) */}
                            <motion.div
                                className="flex-1 w-full"
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                {feature.video ? (
                                    <video
                                        src={feature.video}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full aspect-[21/9] max-h-[50vh] rounded-2xl shadow-md object-contain"
                                    />
                                ) : (
                                    <img
                                        src={feature.img}
                                        alt={feature.title}
                                        className="w-full rounded-2xl shadow-md object-cover"
                                    />
                                )}
                            </motion.div>

                            {/* TEXT */}
                            <motion.div
                                className="flex-1 text-center md:text-left"
                                initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <h3 className="text-2xl sm:text-3xl font-light mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        </div>
                    ))}
                </div>
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
