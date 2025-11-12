import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const MAX_SCROLL = 600;

        const handleScroll = () => {
            const y = Math.min(window.scrollY, MAX_SCROLL);
            setScrollY(y);
            if (window.scrollY > MAX_SCROLL) {
                window.scrollTo(0, MAX_SCROLL);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const ANIMATION_END = 300;
    const progress = Math.max(0, Math.min(1, scrollY / ANIMATION_END));

    const text1Opacity = 1 - progress;
    const text1TranslateY = -progress * 100;
    const text1Style = {
        opacity: text1Opacity,
        transform: `translate(-50%, calc(-50% + ${text1TranslateY}px))`,
        willChange: "opacity, transform",
    };

    const text2Opacity = progress;
    const text2TranslateY = 50 * (1 - progress);
    const text2Style = {
        opacity: text2Opacity,
        transform: `translate(-50%, calc(-50% + ${text2TranslateY}px - 100px))`,
        willChange: "opacity, transform",
    };

    // --- Waitlist form state ---
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleWaitlistSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        setError(null);

        const apiUrl = new URL("https://api.fyndd.in/api/waitlist");
        apiUrl.searchParams.append("email", email);

        try {
            const response = await fetch(apiUrl.toString(), { method: "POST" });

            if (!response.ok) {
                let errorMsg = "Submission failed. Please try again.";
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch {}
                throw new Error(errorMsg);
            }

            setIsSubmitted(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="
            relative w-screen min-h-[200vh]
            overflow-x-hidden
            bg-no-repeat bg-top
            bg-[length:100%_auto]
            sm:bg-[url('https://fyndd-storage.s3.ap-south-1.amazonaws.com/background_1.png')]
            bg-[url('https://fyndd-storage.s3.ap-south-1.amazonaws.com/background+(1).png')]
          "
        >
            {/* --- Background Video --- */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover -z-10"
                autoPlay
                muted
                loop
                playsInline
            >
                <source
                    src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/bg_vid.webm"
                    type="video/webm"
                />
                <source
                    src="https://fyndd-storage.s3.ap-south-1.amazonaws.com/bg_vid_web.mp4"
                    type="video/mp4"
                />
                Your browser does not support the video tag.
            </video>

            <div className="absolute top-0 left-0 w-full h-full bg-orange-500 opacity-10 -z-5" />

            <img
                src="./logo.svg"
                alt="Logo"
                className="fixed top-5 left-5 w-24 sm:w-50 z-50"
            />

            {/* --- Text Block 1 --- */}
            <h1
                className="
                    fixed top-1/2 left-1/2
                    w-full text-center
                    text-white text-[4rem] sm:text-7xl
                    leading-tight font-['Briston']
                    z-50 whitespace-pre-line drop-shadow-lg
                "
                style={text1Style}
            >
                {`Finding Fits
Will Never
Be Easier.`}
            </h1>

            {/* --- Text Block 2 + Form --- */}
            <h1
                className="
                    fixed top-1/2 left-1/2
                    w-full text-center text-white
                    z-50 drop-shadow-lg
                "
                style={text2Style}
            >
                <div
                    className="
                        text-[4rem] sm:text-7xl
                        leading-tight font-['Helvetica']
                    "
                >
                    FYNDD.
                </div>

                <div
                    className="
                        text-[1rem] sm:text-2xl
                        font-['HelveticaCustom']
                        tracking-wide opacity-90
                        mt-1 sm:mt-2
                    "
                >
                    Be among the first to experience the future
                </div>

                {!isSubmitted ? (
                    <form
                        className="w-full flex flex-col items-center mt-4 sm:mt-6 px-4"
                        onSubmit={handleWaitlistSubmit}
                    >
                        <div className="flex w-full max-w-xs sm:max-w-xs">
                            <input
                                type="email"
                                placeholder="your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                className="
                                    flex-grow w-full py-3 pl-5
                                    text-white placeholder-white placeholder-opacity-70
                                    rounded-l-lg focus:outline-none
                                    focus:ring-2 focus:ring-[#ffc870]/80
                                    text-sm sm:text-base border-t border-l border-b border-white/20
                                    appearance-none transition-all duration-300
                                    disabled:opacity-50
                                "
                                style={{
                                    background: "rgba(255, 255, 255, 0.12)",
                                    backdropFilter: "blur(24px) saturate(180%)",
                                    WebkitBackdropFilter:
                                        "blur(24px) saturate(180%)",
                                    boxShadow:
                                        "inset 0 1px 2px rgba(255, 255, 255, 0.25), 0 4px 32px rgba(255, 200, 112, 0.08)",
                                    border: "1px solid rgba(255, 255, 255, 0.25)",
                                }}
                            />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="
                                    flex-shrink-0 flex items-center justify-center
                                    py-3 aspect-square bg-[#ffc870]/80 text-black
                                    rounded-r-lg border border-[#ffc870]/60
                                    shadow-[0_0_20px_2px_rgba(255,200,112,0.35)]
                                    transition-all duration-300
                                    hover:bg-[#ffd68a]
                                    hover:shadow-[0_0_35px_4px_rgba(255,200,112,0.6)]
                                    active:scale-95
                                    focus:outline-none
                                    focus:ring-4 focus:ring-[#ffc870]/70
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                "
                            >
                                {isLoading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 sm:h-6 sm:w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                                            5.291A7.962 7.962 0 014 12H0c0 
                                            3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2.5}
                                        stroke="currentColor"
                                        className="w-5 h-5 sm:w-6 sm:w-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {error && (
                            <div className="mt-2 text-sm text-red-400 font-['HelveticaCustom']">
                                {error}
                            </div>
                        )}
                    </form>
                ) : (
                    <div className="mt-4 sm:mt-6 text-lg sm:text-xl font-['HelveticaCustom'] text-[#ffd68a]">
                        Thank you for joining the waitlist!
                    </div>
                )}
            </h1>

            <div
                className="
                    fixed bottom-0 left-0 w-full h-[30vh]
                    bg-gradient-to-t from-black to-transparent
                    pointer-events-none -z-40
                "
            />
        </div>
    );
}

export default App;
