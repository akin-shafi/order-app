"use client";

import { useForm, Controller } from "react-hook-form";
import { Mail, X } from "lucide-react";
import PhoneNumberInput from "../PhoneNumberInput";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onLogin: () => void;
}

interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  referralCode: string;
}

export default function SignupModal({
  isOpen,
  onClose,
  onSuccess,
  onLogin,
}: SignupModalProps) {
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      referralCode: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    if (!/^\+234\d{10}$/.test(data.phoneNumber)) {
      console.error("Invalid phone number submitted:", data.phoneNumber);
      return; // Prevent submission if invalid
    }
    try {
      console.log("Form submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
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
      <div className="bg-white rounded-lg rounded-top w-full max-w-md relative md:max-w-md mobile-modal">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md border text-gray-400 hover:text-gray-600 p-2 bg-white"
        >
          <X size={20} />
        </button>

        <div className="p-6 mt-10">
          <h2 className="text-2xl font-bold text-center mb-2 text-black">
            Sign Up
          </h2>
          <p className="text-gray-500 text-center mb-6">Sign Up to continue.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* FirstName and LastName Side by Side */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium mb-1 text-black"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                    errors.firstName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#000000]"
                  }`}
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium mb-1 text-black"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 ${
                    errors.lastName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#000000]"
                  }`}
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

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
                      "Please enter a valid Nigerian phone number (e.g., +2348145360866 or 08098290445)",
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

            {/* Referral Code */}
            <div>
              <label
                htmlFor="referralCode"
                className="block text-sm font-medium mb-1 text-black"
              >
                Referral Code (Optional)
              </label>
              <input
                id="referralCode"
                type="text"
                placeholder="Enter referral code"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 bg-white text-black placeholder-gray-500 border-gray-300 focus:ring-[#000000]"
                {...register("referralCode")}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#000000] text-white cursor-pointer py-3 rounded-md hover:bg-[#FF6600] transition-colors focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting ? "Processing..." : "Next"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-500">
              Have an Account?{" "}
              <button
                type="button"
                className="text-[#FF6600] cursor-pointer font-medium hover:underline"
                onClick={onLogin}
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
