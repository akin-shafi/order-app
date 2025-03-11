import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";

interface JoinWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

export default function JoinWaitlistModal({
  isOpen,
  onClose,
  address,
}: JoinWaitlistModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default behavior
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (error) {
      console.error("Error joining waitlist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-opacity z-[150] flex items-center justify-center animate-in fade-in duration-300">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 relative animate-in slide-in-from-bottom duration-500">
        <button
          type="button"
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
              We&apos;ll notify you as soon as we start delivering to:
            </p>
            <p className="text-sm font-medium text-black mt-1">{address}</p>
          </div>

          {!submitted ? (
            <div className="space-y-4">
              {/* Temporarily removed form inputs for debugging */}
              <button
                type="button"
                onClick={handleSubmit}
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
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-4">✨</div>
              <h3 className="text-lg font-semibold text-black mb-2">
                You&apos;re on the list!
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                We&apos;ll notify you as soon as we start delivering to your
                area.
              </p>
              <button
                type="button"
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
