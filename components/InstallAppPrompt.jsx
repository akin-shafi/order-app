"use client";
import React, { useState, useEffect } from "react";
import { Share } from "lucide-react";

const InstallAppPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

    // Detect if the app is running as standalone (PWA mode)
    const isStandalone =
      window.navigator.standalone ||
      window.matchMedia("(display-mode: standalone)").matches;

    // Show the prompt only if it's an iPhone and not in standalone mode
    if (isIOS && !isStandalone) {
      setShowPrompt(true);

      // Set a timer to automatically remove the prompt after 1 minute (60,000ms)
      const hidePromptTimeout = setTimeout(() => {
        setShowPrompt(false);
      }, 60000); // 1 minute (60 seconds)

      // Cleanup the timeout when the component unmounts or showPrompt changes
      return () => {
        clearTimeout(hidePromptTimeout);
      };
    }
  }, []);

  const handleClose = () => {
    setShowPrompt(false);
  };

  return (
    <>
      {showPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 bg-black text-white p-4 rounded-lg shadow-lg z-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-md mx-auto">
          <p className="text-sm md:text-base font-medium">
            Install this app on your iOS device: tap{" "}
            <span className="inline-flex items-center mx-1 bg-orange-500 text-black px-2 py-1 rounded-full text-xs font-semibold">
              <Share size={14} className="mr-1" />
              Share
            </span>{" "}
            then "Add to Home Screen".
          </p>
          <button
            className="bg-orange-500 text-black px-4 py-2 rounded-md font-medium text-sm hover:bg-orange-600 transition-colors w-full sm:w-auto"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default InstallAppPrompt;
