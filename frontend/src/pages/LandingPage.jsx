import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import {useNavigate} from "react-router-dom";

export default function LandingPage() {
    const ref = useRef(null);
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"]
    });

    // Animate Fyndd scaling + fading with scroll
    const scale = useTransform(scrollYProgress, [0, 0.3], [1, 6]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    return (
        <div className="min-h-[300vh] bg-white text-black overflow-hidden" ref={ref}>
            {/* Hero Section */}
            <motion.div
                style={{ scale, opacity }}
                className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center"
            >
                <h2 className="text-[100px] font-extralight text-gray-900 tracking-[0.2em]">
                    FYNDD
                </h2>
                <p className="text-xl font-light">ONE SEARCH DOES IT ALL</p>
            </motion.div>

            {/* Spacer to allow scroll */}
            <div className="h-screen"></div>

            {/* Features Section */}
            <section className="h-screen flex flex-col items-center justify-center space-y-10">
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
                        <span className="text-3xl">{item.icon}</span>
                        <p className="text-xl font-medium mt-2">{item.title}</p>
                    </motion.div>
                ))}
            </section>

            {/* CTA Section */}
            <section className="relative z-50 h-screen flex flex-col items-center justify-center">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-4 bg-black text-white rounded-full text-lg font-medium shadow-md cursor-pointer"
                    onClick={() => navigate("/home")}
                >
                    Try Fyndd Now
                </motion.button>
            </section>
        </div>
    );
}
