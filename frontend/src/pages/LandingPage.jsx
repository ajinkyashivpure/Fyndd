import React, { useState } from "react";
import { Typewriter } from "react-simple-typewriter";
// import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

    const handleTypingDone = () => {
        setTimeout(() => setShowResults(true), 600);
    };

    const handleCTA = () => {
        navigate("/home");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 px-4">
            {/* Headline */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-6 text-center"
            >
                Search. Discover. Shop Effortlessly.
            </motion.h1>

            {/* Subtext */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-center mb-10 max-w-xl"
            >
                Fyndd isn’t just another e-commerce site — it’s a <span className="font-semibold">smart discovery platform</span>
                that connects you instantly to trusted brands like <strong>H&M</strong>, <strong>Levi’s</strong>, and <strong>Missprint Jaipur</strong>.
            </motion.p>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-lg bg-gray-100 shadow-sm rounded-full flex items-center px-5 py-3"
            >
                <span className="text-gray-400 mr-2 text-xl">🔍</span>
                <span className="text-lg font-medium text-gray-800">
          <Typewriter
              words={[
                  "White Oversized Shirt",
                  "Black Denim Jacket",
                  "Jaipur Printed Kurti",
              ]}
              loop={false}
              typeSpeed={80}
              deleteSpeed={0}
              onLoopDone={handleTypingDone}
          />
        </span>
                <span className="ml-2 cursor-blink text-gray-500">|</span>
            </motion.div>

            {/* Loading shimmer */}
            {!showResults && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="mt-4 text-sm text-gray-400"
                >
                    Searching across trusted brands…
                </motion.div>
            )}

            {/* Results cards */}
            {showResults && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10"
                >
                    {[
                        { brand: "H&M", name: "White Oversized Shirt" },
                        { brand: "Levi’s", name: "Cotton Relaxed Fit" },
                        { brand: "Missprint Jaipur", name: "Linen Casual Shirt" },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.3 }}
                            className="bg-white border rounded-2xl shadow-md p-4 flex flex-col items-center"
                        >
                            <div className="w-20 h-20 bg-gray-100 rounded-lg mb-3" />
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-gray-500 text-sm mt-1">{item.brand}</p>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* CTA Button */}
            {showResults && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="mt-10"
                >
                    <button
                        onClick={handleCTA}
                        className="bg-black text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-800 transition"
                    >
                        Discover Yours →
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default LandingPage;
