/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import PhoneNumberInput from "../PhoneNumberInput";
import { useAuth } from "@/contexts/auth-context";
import { useModal } from "@/contexts/modal-context";
import { toast } from "react-hot-toast";
import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginFormValues {
  phoneNumber: string;
  otp: string;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, verifyOTP } = useAuth();
  const { openModal } = useModal();
  const [showOTP, setShowOTP] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormValues>({
    defaultValues: {
      phoneNumber: "",
      otp: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (!showOTP) {
      if (!/^\d{10}$/.test(data.phoneNumber)) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }

      try {
        await login(data.phoneNumber);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      } catch (error) {
        toast.error("Failed to send OTP. Please try again.");
      }
    } else {
      try {
        await verifyOTP(data.phoneNumber, data.otp);
        toast.success("Logged in successfully!");
        onClose();
      } catch (error) {
        toast.error("Invalid OTP. Please try again.");
      }
    }
  };

  const handlePhoneBlur = (value: string) => {
    if (value && !/^\d{10}$/.test(value)) {
      toast.error("Please enter a valid 10-digit phone number");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-brand-opacity flex items-center justify-center p-4 md:items-center md:justify-center">
      <div className="bg-white rounded-lg w-full max-w-md relative md:max-w-md mobile-modal">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md border text-gray-400 hover:text-gray-600 p-2 bg-white"
        >
          <X size={20} />
        </button>

        <div className="p-6 mt-10">
          <h2 className="text-2xl font-bold text-center mb-2 text-black">
            {showOTP ? "Enter OTP" : "Sign In"}
          </h2>
          <p className="text-black text-center mb-6">
            {showOTP
              ? "Enter the OTP sent to your phone"
              : "Sign In to continue."}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!showOTP ? (
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
                      value: /^\d{10}$/,
                      message:
                        "Please enter a valid 10-digit phone number (e.g., 8098290445)",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <PhoneNumberInput
                      value={value || ""}
                      onChange={onChange}
                      onFocus={() => console.log("Phone input focused")}
                      onBlur={handlePhoneBlur}
                      hasError={!!errors.phoneNumber}
                    />
                  )}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium mb-1 text-black"
                >
                  Enter OTP
                </label>
                <Controller
                  name="otp"
                  control={control}
                  rules={{
                    required: "OTP is required",
                    pattern: {
                      value: /^\d{4}$/,
                      message: "Please enter a valid 4-digit OTP",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <div className="flex gap-2 justify-center">
                      {[0, 1, 2, 3].map((index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6600]"
                          value={value?.[index] || ""}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            if (!/^\d*$/.test(newValue)) return;

                            const currentValue = value || "";
                            const newOtp = currentValue.split("");
                            newOtp[index] = newValue;

                            // Move to next input if value is entered
                            if (newValue && index < 3) {
                              const nextInput = document.querySelector(
                                `input[name="otp-${index + 1}"]`
                              ) as HTMLInputElement;
                              nextInput?.focus();
                            }

                            onChange(newOtp.join(""));
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Backspace" &&
                              !value?.[index] &&
                              index > 0
                            ) {
                              const prevInput = document.querySelector(
                                `input[name="otp-${index - 1}"]`
                              ) as HTMLInputElement;
                              prevInput?.focus();
                            }
                          }}
                          name={`otp-${index}`}
                        />
                      ))}
                    </div>
                  )}
                />
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.otp.message}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF6600] text-white py-3 rounded-md hover:bg-[#000000] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting
                ? showOTP
                  ? "Verifying..."
                  : "Sending OTP..."
                : showOTP
                ? "Verify OTP"
                : "Next"}
            </button>
          </form>

          {!showOTP && (
            <div className="mt-4 text-center">
              <p className="text-black">
                Don&apos;t have an Account?{" "}
                <button
                  type="button"
                  className="text-[#FF6600] cursor-pointer font-medium hover:underline"
                  onClick={() => {
                    onClose();
                    openModal("signup");
                  }}
                >
                  Create One
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
