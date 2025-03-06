"use client";

import {
  useForm,
  // Controller
} from "react-hook-form";
import { X } from "lucide-react";
import "react-phone-input-2/lib/style.css";
// import PhoneNumberInput from "../PhoneNumberInput";

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
    // control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      console.log("Login form submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-brand-opacity flex items-center justify-center p-4 md:items-center md:justify-center">
      <div className="bg-white rounded-lg rounded-top w-full max-w-md relative md:max-w-md mobile-modal">
        <button
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
              {/* <Controller
                name="phoneNumber"
                control={control}
                rules={{ required: "Phone number is required" }} // Basic required validation
                render={({ field: { onChange, value } }) => (
                  <PhoneNumberInput
                    phoneNo={value}
                    setPhoneNo={(val) => {
                      console.log("PhoneNo changed to:", val); // Debug the change
                      onChange(val);
                    }}
                    onFocus={() => console.log("Phone input focused")}
                  />
                )}
              /> */}
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
              {`Don’t have an Account?`}{" "}
              <button
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
