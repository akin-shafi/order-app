/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "react-toastify";


interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string; // Passed from LoginModal
}

interface OTPFormValues {
  otp: string;
}

export default function OTPModal({
  isOpen,
  onClose,
  phoneNumber,
}: OTPModalProps) {
  const { verifyOTP } = useAuth();
  
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OTPFormValues>({
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: OTPFormValues) => {
    try {
      await verifyOTP(phoneNumber, data.otp);
      toast.success("Logged in successfully!");
      onClose();
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-brand-opacity flex items-center justify-center p-4 md:items-center md:justify-center">
      <div className="bg-white rounded-xl w-full max-w-md relative md:max-w-md mobile-modal">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-gray-600 p-2 bg-white rounded-full z-60"
        >
          <X size={20} />
        </button>

        <div className="p-6 mt-10">
          <h2 className="text-2xl font-bold text-center mb-2 text-black">
            Enter OTP
          </h2>
          <p className="text-black text-center mb-6">
            Enter the OTP sent to your phone
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              {/* <label
                htmlFor="otp"
                className="block text-sm font-medium mb-1 text-black"
              >
                Enter OTP
              </label> */}
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF6600] text-white py-3 rounded-md hover:bg-[#000000] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
