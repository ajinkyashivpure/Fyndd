import React, { useState, useEffect } from "react";
import "./index.css";

// --- Helper Hook (No longer needed for this logic) ---
// const useIsMobile = ... (Removed as it's not used anymore)

function App() {
  const [scrollY, setScrollY] = useState(0);

  // --- 1. Define constant for clarity ---
  const ANIMATION_END = 300; // This is now the max scroll for ALL devices

  // --- (Removed DESKTOP_MAX_SCROLL) ---
  // --- (Removed const isMobile = useIsMobile()) ---

  useEffect(() => {
    // --- 3. Set the scroll limit ---
    // The scroll is limited to the end of the animation for all screen sizes.
    const MAX_SCROLL = ANIMATION_END;

    const handleScroll = () => {
      // Only update state up to the max scroll limit
      const y = Math.min(window.scrollY, MAX_SCROLL);
      setScrollY(y);

      // --- 4. Enforce the limit ---
      // If user scrolls past the limit, physically scroll them back
      if (window.scrollY > MAX_SCROLL) {
        window.scrollTo(0, MAX_SCROLL);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup listener
    return () => window.removeEventListener("scroll", handleScroll);

    // --- 5. Dependency array is now empty ---
    // The effect runs once on mount and no longer needs
    // to track the 'isMobile' state.
  }, []);

  // Calculate animation progress (a value from 0 to 1)
  const progress = Math.max(0, Math.min(1, scrollY / ANIMATION_END));

  // Style for the first text ("Finding Fits...")
  const text1Style = {
    opacity: 1 - progress, // Fades out
    transform: `translate(-50%, calc(-50% + ${-progress * 100}px))`, // Moves up
    willChange: "opacity, transform",
  };

  // Style for the second text ("FYNDD." + form)
  const text2Style = {
    opacity: progress, // Fades in
    transform: `translate(-50%, calc(-50% + ${(1 - progress) * 50}px - 100px))`, // Moves up from below
    willChange: "opacity, transform",
  };

  // Waitlist form state
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Form submission handler
  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    // Build API URL with email as a query parameter
    const apiUrl = new URL("https://api.fyndd.in/api/waitlist");
    apiUrl.searchParams.append("email", email);

    try {
      const response = await fetch(apiUrl.toString(), { method: "POST" });

      if (!response.ok) {
        // Try to parse error message from API, otherwise use a default
        const errorData = await response.json().catch(() => {});
        throw new Error(errorData?.message || "Submission failed.");
      }

      // Success
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
        bg-white
        bg-no-repeat bg-top
        bg-[length:100%_auto]
        sm:bg-[url('https://fyndd-storage.s3.ap-south-1.amazonaws.com/background_1.png')]
        bg-[url('https://fyndd-storage.s3.ap-south-1.amazonaws.com/background+(1).png')]
      "
    >
      {/* Base background color */}
      <div className="absolute inset-0 bg-white -z-20" />

      {/* Logo */}
      <img
        src="./logo.svg"
        alt="Logo"
        className="fixed top-5 left-5 w-24 sm:w-50 z-50"
      />

      {/* Text 1: "Finding Fits..." */}
      <h1
        className="
          fixed top-1/2 left-1/2
          w-full text-center
          text-black text-[4rem] sm:text-7xl
          leading-tight font-['Briston']
          z-50 whitespace-pre-line
        "
        style={text1Style}
      >
        {/* --- Main Text --- */}
        {`Finding Fits
Will `}
        <span style={{ color: "#5e4fb7ff" }}>Never</span>
        {`
Be Easier.`}

        {/* --- UPDATED: Swipe Down Hint --- */}
        <div
          className="
            flex flex-col items-center justify-center /* <-- CHANGED: to flex-col */
            mt-4 sm:mt-6 
            font-['HelveticaCustom'] 
            text-base sm:text-lg /* <-- CHANGED: increased text size */
            opacity-70
          "
        >
          Swipe Up
          <img
            src="./sd.gif"
            alt="Swipe down animation"
            className="w-6 h-6 sm:w-8 sm:h-8 mt-2" /* <-- CHANGED: increased size and added margin-top */
          />
        </div>
        {/* --- End of Updated Hint --- */}
      </h1>

      {/* Text 2: "FYNDD." + Form */}
      <h1
        className="
          fixed top-1/2 left-1/2
          w-full text-center text-black
          z-50
        "
        style={text2Style}
      >
        {/* "FYNDD." */}
        <div className="text-[4rem] sm:text-7xl leading-tight font-['Helvetica']">
          FYNDD.
        </div>

        {/* Subtitle */}
        <div
          className="
            text-[1rem] sm:text-2xl
            font-['HelveticaCustom']
            tracking-wide opacity-90
            mt-1 sm:mt-2
            font-bold
          "
        >
          Be among the first to experience the future
          <br />
          Join The Waitlist!
        </div>

        {/* Conditional Form / Success Message */}
        {!isSubmitted ? (
          // --- Form ---
          <form
            className="w-full flex flex-col items-center mt-4 sm:mt-6 px-4"
            onSubmit={handleWaitlistSubmit}
          >
            <div className="flex w-full max-w-xs sm:max-w-xs">
              {/* Email Input */}
              <input
                type="email"
                placeholder="your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="
                  flex-grow w-full py-3 pl-5
                  text-black placeholder-black placeholder-opacity-70
                  rounded-l-lg focus:outline-none
                  focus:ring-2 focus:ring-[#5e4fb7]/80
                  text-sm sm:text-base
                  border border-black/20
                  appearance-none transition-all duration-300
                  disabled:opacity-50
                "
                style={{
                  background: "rgba(0, 0, 0, 0.05)",
                  backdropFilter: "blur(12px)",
                }}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  flex-shrink-0 flex items-center justify-center
                  py-3 aspect-square bg-[#5e4fb7] text-white
                  rounded-r-lg border border-[#5e4fb7]
                  transition-all duration-300
                  hover:bg-[#50439a]
                  active:scale-95
                  focus:outline-none
                  focus:ring-4 focus:ring-[#5e4fb7]/70
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isLoading ? (
                  // Loading Spinner
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  // Arrow Icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5 sm:w-6 sm:h-6"
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

            {/* Error Message */}
            {error && (
              <div className="mt-2 text-sm text-red-400 font-['HelveticaCustom']">
                {error}
              </div>
            )}
          </form>
        ) : (
          // --- Success Message ---
          <div className="mt-4 sm:mt-6 text-lg sm:text-xl font-['HelveticaCustom'] text-[#ffd68a]">
            Thank you for joining the waitlist!
          </div>
        )}
      </h1>

      {/* Bottom fade gradient */}
      <div
        className="
          fixed bottom-0 left-0 w-full h-[30vh]
          bg-gradient-to-t from-white to-transparent
          pointer-events-none -z-40
        "
      />
    </div>
  );
}

export default App;