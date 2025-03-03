"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "libphonenumber-js";
import { X } from "lucide-react";
import "react-phone-number-input/style.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onCreateAccount: () => void;
}

const loginSchema = z.object({
  phoneNumber: z.string().refine(
    (value) => {
      return value && isValidPhoneNumber(value);
    },
    { message: "Please enter a valid phone number" }
  ),
});

type LoginFormValues = z.infer<typeof loginSchema>;

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
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Here you would typically send the data to your API
      console.log("Login form submitted:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-2">Log In</h2>
          <p className="text-gray-500 text-center mb-6">
            you need to login to continue.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium mb-1"
              >
                Phone Number
              </label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    international
                    defaultCountry="NG"
                    value={value}
                    onChange={onChange}
                    inputComponent={({ ...props }) => (
                      <input
                        {...props}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 ${
                          errors.phoneNumber
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-[#1A2E20]"
                        }`}
                      />
                    )}
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
              className="w-full bg-[#1A2E20] text-white py-3 rounded-md hover:bg-[#5a2018] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A2E20] focus:ring-offset-2 disabled:opacity-70"
            >
              {isSubmitting ? "Processing..." : "Next"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-500">
              Don&apos;t have an Account?{" "}
              <button
                className="text-black font-medium hover:underline"
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
