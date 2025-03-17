/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { Share } from "lucide-react";

const InstallAppPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [browser, setBrowser] = useState<string>("");

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /ipad|iphone|ipod/.test(userAgent) && !("MSStream" in window);
    const isAndroid = /android/.test(userAgent);
    const isStandalone =
      "standalone" in navigator &&
      (navigator.standalone ||
        window.matchMedia("(display-mode: standalone)").matches);

    // Detect browser
    if (userAgent.includes("chrome")) {
      setBrowser("chrome");
    } else if (userAgent.includes("firefox")) {
      setBrowser("firefox");
    } else {
      setBrowser("other");
    }

    // Handle Android PWA install prompt (Chrome-specific)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (isAndroid && !isStandalone && browser === "chrome") {
        setShowPrompt(true);
      }
    };

    // Show prompt for iOS or Android if not in standalone mode
    if ((isIOS || isAndroid) && !isStandalone) {
      setShowPrompt(true);

      // Add event listener for Android PWA prompt (Chrome)
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
  }, [browser]);

  const handleInstallClick = async () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /ipad|iphone|ipod/.test(userAgent) && !("MSStream" in window);

    if (isIOS) {
      alert(
        'In Safari, tap the "Share" icon at the bottom (or top) of the screen, then select "Add to Home Screen".'
      );
    } else if (browser === "chrome" && deferredPrompt) {
      // For Chrome on Android, trigger the deferred prompt
      (deferredPrompt as any).prompt();
      const { outcome } = await (deferredPrompt as any).userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the A2HS prompt in Chrome");
      } else {
        console.log("User dismissed the A2HS prompt in Chrome");
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else if (browser === "firefox") {
      alert(
        'In Firefox, tap the menu icon (three dots) in the top-right corner, then select "Add to Home Screen".'
      );
    } else {
      alert(
        "To install this app, look for an option like 'Add to Home Screen' in your browser’s menu or share settings."
      );
    }
  };

  const getInstructionText = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /ipad|iphone|ipod/.test(userAgent);

    if (isIOS) {
      return (
        <>
          tap{" "}
          <span className="inline-flex items-center mx-1 bg-orange-500 text-black px-2 py-1 rounded-full text-xs font-semibold">
            <Share size={14} className="mr-1" />
            Share
          </span>{" "}
          in Safari, then &quot;Add to Home Screen&quot;.
        </>
      );
    } else if (browser === "chrome") {
      return (
        <>
          tap{" "}
          <span className="inline-flex items-center mx-1 bg-orange-500 text-black px-2 py-1 rounded-full text-xs font-semibold">
            <Share size={14} className="mr-1" />
            Share
          </span>{" "}
          in the URL bar, then &quot;Add to Home Screen&quot;.
        </>
      );
    } else if (browser === "firefox") {
      return (
        <>tap the menu (three dots), then &quot;Add to Home Screen&quot;.</>
      );
    } else {
      return <>use your browser’s menu to add to home screen.</>;
    }
  };

  return (
    <>
      {showPrompt && (
        <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 bg-black text-white p-4 rounded-lg shadow-lg z-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 max-w-md mx-auto">
          <p className="text-sm md:text-base font-medium">
            Install this app on your device: {getInstructionText()}
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
