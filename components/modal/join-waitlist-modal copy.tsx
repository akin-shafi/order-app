import { useState, useRef, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";
import PhoneNumberInput from "../PhoneNumberInput";
import { useForm, Controller } from "react-hook-form";

interface JoinWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

interface FormData {
  email: string;
  phoneNumber: string;
}

export default function JoinWaitlistModal({
  isOpen,
  onClose,
  address,
}: JoinWaitlistModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      // Ensure inputs don't have focus on mount
      if (emailInputRef.current) {
        emailInputRef.current.blur();
      }
      if (phoneInputRef.current) {
        phoneInputRef.current.blur();
      }
    }
  }, [isOpen]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-brand-opacity flex items-center justify-center p-4 md:items-center md:justify-center">
      <div className="bg-white rounded-lg w-full max-w-md relative md:max-w-md mobile-modal">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="p-6">
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
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: "Email is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      ref={emailInputRef}
                      type="email"
                      id="email"
                      autoFocus={false}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15736] text-black"
                      placeholder="Enter your email"
                    />
                  )}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
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
                      ref={phoneInputRef}
                      autoFocus={false}
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
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#f15736] text-white py-3 rounded-lg hover:bg-[#d8432c] transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Joining...
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
