"use client";

import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import Image from "next/image";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onCreateAccount: () => void;
}

interface LoginFormValues {
  phoneNumber: string;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  onCreateAccount,
}: LoginModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (!/^\+234\d{10}$/.test(data.phoneNumber)) {
      console.error("Invalid phone number submitted:", data.phoneNumber);
      return; // Prevent submission if invalid
    }
    try {
      console.log("Login form submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    let value = e.target.value.trim();
    const cleanedValue = value.replace(/[^+\d]/g, ""); // Remove non-digits except +

    // Handle local (e.g., "08098290445") or international (e.g., "+2348145360866")
    if (cleanedValue.startsWith("0") && !cleanedValue.startsWith("+")) {
      value = "+234" + cleanedValue.slice(1); // Convert local to international
    } else if (!cleanedValue.startsWith("+234") && cleanedValue.length > 0) {
      value = "+234" + cleanedValue; // Prepend +234 if missing
    } else {
      value = cleanedValue; // Keep as is if it starts with +234
    }

    // Limit to 13 characters (+234 and 10 digits)
    if (value.length > 13) {
      value = value.slice(0, 13);
    }

    console.log("Phone number changed:", value);
    onChange(value);
  };

  const handlePhoneBlur = (value: string) => {
    if (value && !/^\+234\d{10}$/.test(value)) {
      console.warn("Invalid Nigerian phone number:", value);
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
            Sign In
          </h2>
          <p className="text-black text-center mb-6">Sign In to continue.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                      "Please enter a valid Nigerian phone number (e.g., +2348145360866 or 08098290445)",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <div className="flex items-center w-full border border-gray-300 rounded-md h-[38px] overflow-hidden">
                    {/* Flag and Country Code Prefix */}
                    <div className="flex items-center bg-gray-100 border-r border-gray-300 px-2 h-full">
                      <Image
                        src="/flags/ng.png" // Nigerian flag in public/flags/ng.png
                        alt="Nigeria Flag"
                        width={24}
                        height={16}
                        className="mr-1"
                      />
                      <span className="text-black font-medium">+234</span>
                    </div>
                    {/* Phone Input */}
                    <input
                      type="tel"
                      value={value || ""}
                      onChange={(e) => handlePhoneChange(e, onChange)}
                      onFocus={() => console.log("Phone input focused")}
                      onBlur={() => handlePhoneBlur(value || "")}
                      placeholder="8098290445"
                      className="flex-1 h-full p-2 text-black focus:outline-none focus:ring-1 focus:ring-[#1A2E20] rounded-r-md"
                      maxLength={13}
                    />
                  </div>
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
              className="w-full bg-[#1A2E20] text-white py-3 rounded-md hover:bg-[#FF6600] cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A2E20] focus:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting ? "Processing..." : "Next"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-black">
              Don’t have an Account?{" "}
              <button
                type="button"
                className="text-[#FF6600] cursor-pointer font-medium hover:underline"
                onClick={onCreateAccount}
              >
                Create One
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
