/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState, useRef } from "react";
import { X, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { User } from "@/types/user"; // Adjust the path as needed

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { edit } = useAuth(); // Destructure the edit function from useAuth

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phoneNumber: user?.phoneNumber || "",
    email: user?.email || "",
    dateOfBirth: user?.dateOfBirth || "",
  });

  const [error, setError] = useState<string | null>(null);
  // Correctly typed refs
  const fullNameInputRef = useRef<HTMLInputElement>(null);
  const phoneNumberInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const dateOfBirthInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Blur any active element when the modal opens to prevent autofocus
  useEffect(() => {
    if (isOpen) {
      // Blur any active element to prevent autofocus
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      // Blur inputs if there's an error
      if (error) {
        if (fullNameInputRef.current) fullNameInputRef.current.blur();
        if (phoneNumberInputRef.current) phoneNumberInputRef.current.blur();
        if (emailInputRef.current) emailInputRef.current.blur();
        if (dateOfBirthInputRef.current) dateOfBirthInputRef.current.blur();
      }
    }
  }, [isOpen, error]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission from causing a reload
    e.stopPropagation(); // Stop event bubbling
    try {
      await edit(formData); // Call the edit function from AuthContext
      // Blur all inputs before closing
      if (fullNameInputRef.current) fullNameInputRef.current.blur();
      if (phoneNumberInputRef.current) phoneNumberInputRef.current.blur();
      if (emailInputRef.current) emailInputRef.current.blur();
      if (dateOfBirthInputRef.current) dateOfBirthInputRef.current.blur();
      // Small delay to ensure blur happens before modal transition
      setTimeout(() => {
        onClose();
      }, 50);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any unintended form submission
    e.stopPropagation(); // Stop event bubbling
    // Blur all inputs before closing
    if (fullNameInputRef.current) fullNameInputRef.current.blur();
    if (phoneNumberInputRef.current) phoneNumberInputRef.current.blur();
    if (emailInputRef.current) emailInputRef.current.blur();
    if (dateOfBirthInputRef.current) dateOfBirthInputRef.current.blur();
    // Small delay to ensure blur happens before modal transition
    setTimeout(() => {
      onClose();
    }, 50);
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
                  Edit Profile
                </h2>
                <button
                  className="group relative cursor-pointer w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                  onClick={handleCancel}
                  aria-label="Close modal"
                >
                  <X
                    size={24}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </button>
              </div>

              {/* Form Section */}
              <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Account Name */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm text-gray-500 mb-1"
                    >
                      Account name
                    </label>
                    <div
                      className="relative"
                      onClick={() => {
                        if (fullNameInputRef.current) {
                          fullNameInputRef.current.focus();
                        }
                      }}
                    >
                      <input
                        ref={fullNameInputRef}
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-100 rounded-lg text-[#292d32] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        placeholder="Enter your name"
                        autoComplete="off"
                        autoFocus={false} // Explicitly disable autofocus
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm text-gray-500 mb-1"
                    >
                      Phone number
                    </label>
                    <div
                      className="relative"
                      onClick={() => {
                        if (phoneNumberInputRef.current) {
                          phoneNumberInputRef.current.focus();
                        }
                      }}
                    >
                      <input
                        ref={phoneNumberInputRef}
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-100 rounded-lg text-[#292d32] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        placeholder="Enter your phone number"
                        autoComplete="off"
                        autoFocus={false}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm text-gray-500 mb-1"
                    >
                      Email
                    </label>
                    <div
                      className="relative"
                      onClick={() => {
                        if (emailInputRef.current) {
                          emailInputRef.current.focus();
                        }
                      }}
                    >
                      <input
                        ref={emailInputRef}
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-100 rounded-lg text-[#292d32] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        placeholder="Enter your email"
                        autoComplete="off"
                        autoFocus={false}
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm text-gray-500 mb-1"
                    >
                      Date of birth
                    </label>
                    <div
                      className="relative"
                      onClick={() => {
                        if (dateOfBirthInputRef.current) {
                          dateOfBirthInputRef.current.focus();
                        }
                      }}
                    >
                      <input
                        ref={dateOfBirthInputRef}
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full p-3 bg-gray-100 rounded-lg text-[#292d32] font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                        autoComplete="off"
                        autoFocus={false}
                      />
                      <Calendar
                        size={20}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="text-red-500 text-sm text-center">
                      {error}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button" // Explicitly set to prevent form submission
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#FF6600] text-white rounded-lg hover:bg-[#E65C00] transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
