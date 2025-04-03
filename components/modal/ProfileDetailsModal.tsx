/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect } from "react";
import { X, ChevronRight, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { User } from "@/types/user"; // Adjust the path as needed

interface ProfileDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void; // Still optional, but we'll use useAuth().logout instead
}

const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const { user, logout } = useAuth(); // Destructure logout from useAuth
  console.log("user", user);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { x: "100%", opacity: 0, transition: { duration: 0.2 } },
  };

  const defaultAvatar = "/default-avatar.png";

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-end"
          onClick={handleBackdropClick}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-[480px] bg-white h-full fixed top-0 right-0 md:w-[480px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="h-full overflow-y-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {/* Header with Close Button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-[#292d32]">
                  Profile
                </h2>
                <button
                  className="group relative cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X
                    size={24}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </button>
              </div>

              {/* Profile Header Section */}
              <div className="p-4 flex flex-col items-center border-b border-gray-200">
                <div className="relative">
                  <Image
                    src={user?.avatar || defaultAvatar}
                    alt="User Avatar"
                    width={80}
                    height={80}
                    className="rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultAvatar;
                    }}
                  />
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
                    <span className="text-sm">😊</span>
                  </div>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-[#292d32]">
                  {user?.fullName || "User"}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 bg-[#FFF4E5] text-[#FF6600] rounded-full px-2 py-1 text-sm">
                    <span>★</span>
                    <span>1.0</span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#FFF4E5] text-[#FF6600] rounded-full px-2 py-1 text-sm">
                    <span>🪙</span>
                    <span>{user?.wallet_balance || 0}</span>
                  </div>
                </div>
                <div className="mt-2 bg-[#E5E5FF] text-[#6666FF] rounded-full px-4 py-1 text-sm">
                  {user?.wallet_no || "N/A"} | {user?.bank_name || "N/A"}
                </div>
              </div>

              {/* Personal Section */}
              <div className="p-4">
                <h4 className="text-md font-semibold text-[#292d32] mb-2">
                  Personal
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">👤</span>
                      <span>Profile Details</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-500" />
                  </li>
                  <li className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">📍</span>
                      <span>Addresses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#FF6600] text-white rounded-full px-2 py-0.5 text-xs">
                        2
                      </span>
                      <ChevronRight size={20} className="text-gray-500" />
                    </div>
                  </li>
                  <li className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-[#6666FF]">✦</span>
                      <span>Chowpass</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-500" />
                  </li>
                  <li className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">💳</span>
                      <span>Wallet</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-500" />
                  </li>
                </ul>
              </div>

              {/* Services Section */}
              <div className="p-4">
                <h4 className="text-md font-semibold text-[#292d32] mb-2">
                  Services
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">🎁</span>
                      <span>Referrals</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-500" />
                  </li>
                  <li className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-[#FF6600]/10 cursor-pointer">
                    <button
                      onClick={() => {
                        logout(); // Use logout from useAuth
                        if (onLogout) onLogout(); // Call onLogout if provided
                      }}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut size={20} className="text-gray-500" />
                        <span>Logout</span>
                      </div>
                      <ChevronRight size={20} className="text-gray-500" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileDetailsModal;
