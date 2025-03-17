/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Share } from "lucide-react";

const InstallAppPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !("MSStream" in window); // Check for MSStream safely
    const isAndroid = /Android/.test(userAgent);
    const isStandalone =
      "standalone" in navigator && // Check if standalone exists
      (navigator.standalone ||
        window.matchMedia("(display-mode: standalone)").matches);

    // Handle Android PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (isAndroid && !isStandalone) {
        setShowPrompt(true);
      }
    };

    // Show prompt for iOS or Android if not in standalone mode
    if ((isIOS || isAndroid) && !isStandalone) {
      setShowPrompt(true);

      // Add event listener for Android PWA prompt
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      // Auto-hide after 60 seconds
      const hidePromptTimeout = setTimeout(() => {
        setShowPrompt(false);
      }, 60000);

      // Cleanup
      return () => {
        clearTimeout(hidePromptTimeout);
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
      };
    }
  }, []);

  const handleInstallClick = async () => {
    const userAgent = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !("MSStream" in window);

    if (isIOS) {
      alert(
        'To add this app to your home screen, tap the "Share" icon in Safari and select "Add to Home Screen".'
      );
    } else if (deferredPrompt) {
      // For Android, trigger the deferred prompt
      (deferredPrompt as any).prompt();
      const { outcome } = await (deferredPrompt as any).userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  return (
    <>
      {showPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 bg-black text-white p-4 rounded-lg shadow-lg z-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-md mx-auto">
          <p className="text-sm md:text-base font-medium">
            Install this app on your device:{" "}
            {navigator.userAgent.match(/iPad|iPhone|iPod/) ? (
              <>
                tap{" "}
                <span className="inline-flex items-center mx-1 bg-orange-500 text-black px-2 py-1 rounded-full text-xs font-semibold">
                  <Share size={14} className="mr-1" />
                  Share
                </span>
                {' then "Add to Home Screen".'}
              </>
            ) : (
              "click the button to add to your home screen."
            )}
          </p>
          <button
            className="bg-orange-500 text-black px-4 py-2 rounded-md font-medium text-sm hover:bg-orange-600 transition-colors w-full sm:w-auto"
            onClick={handleInstallClick}
          >
            Add to Home Screen
          </button>
        </div>
      )}
    </>
  );
};

export default InstallAppPrompt;
