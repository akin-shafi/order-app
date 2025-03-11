"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Mail, X, Loader2 } from "lucide-react";
import PhoneNumberInput from "../PhoneNumberInput";
import Image from "next/image";

interface JoinWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string; // Added missing address prop
}

interface JoinWaitlistFormValues {
  email: string;
  phoneNumber: string;
}

export default function JoinWaitlistModal({
  isOpen,
  onClose,
  address,
}: JoinWaitlistModalProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<JoinWaitlistFormValues>({
    defaultValues: {
      email: "",
      phoneNumber: "",
    },
  });

  // Refs for preventing autofocus
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Prevent autofocus when modal opens
  useEffect(() => {
    if (isOpen) {
      if (emailInputRef.current) emailInputRef.current.blur();
      if (phoneInputRef.current) phoneInputRef.current.blur();
    }
  }, [isOpen]);

  const onSubmit = async (data: JoinWaitlistFormValues) => {
    if (!/^\+234\d{10}$/.test(data.phoneNumber)) {
      console.error("Invalid phone number submitted:", data.phoneNumber);
      return;
    }
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          phone: data.phoneNumber,
          address,
        }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error joining waitlist:", error);
    }
  };

  const handlePhoneBlur = (value: string) => {
    if (value && !/^\+234\d{10}$/.test(value)) {
      console.warn("Invalid Nigerian phone number:", value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-opacity z-50 flex items-center justify-center p-4 md:items-center md:justify-center">
      <div className="bg-white rounded-lg w-full max-w-md relative md:max-w-md mobile-modal">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md border text-gray-400 hover:text-gray-600 p-2 bg-white"
        >
          <X size={20} />
        </button>

        <div className="p-6 mt-10">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative w-32 h-30 mb-4 rounded bg-gray-100 flex items-center justify-center">
              <Image
                src="/icons/empty_box.png"
                alt="Join Waitlist"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">
              Join our Waitlist
            </h2>
            <p className="text-sm text-gray-500">
              {`We'll notify you as soon as we start delivering to:`}
            </p>
            <p className="text-sm font-medium text-black mt-1">{address}</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email with Icon */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1 text-black"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    // ref={emailInputRef}
                    autoFocus={false}
                    className={`w-full pl-10 p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#000000]"
                    }`}
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium mb-1 text-black"
                >
                  Phone Number
                </label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^\+234\d{10}$/,
                      message:
                        "Please enter a valid Nigerian phone number (e.g., +2348145360866)",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneNumberInput
                      value={value || ""}
                      onChange={onChange}
                      onFocus={() => console.log("Phone input focused")}
                      onBlur={handlePhoneBlur}
                      hasError={!!errors.phoneNumber}
                      ref={phoneInputRef}
                      autoFocus={false}
                    />
                  )}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#000000] text-white cursor-pointer py-3 rounded-md hover:bg-[#FF6600] transition-colors focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Processing...
                  </>
                ) : (
                  "Join Waitlist"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="mb-4">✨</div>
              <h3 className="text-lg font-semibold text-black mb-2">
                {`You're on the list!`}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {`We'll notify you as soon as we start delivering to your area.`}
              </p>
              <button
                onClick={onClose}
                className="w-full bg-[#f15736] text-white py-3 rounded-lg hover:bg-[#d8432c] transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
