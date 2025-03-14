"use client";

import { useModal } from "@/contexts/modal-context";
import LoginModal from "./login-modal";
import SignupModal from "./signup-modal";

export default function ModalContainer() {
  const { modalType, closeModal } = useModal();

  if (!modalType) return null;

  return (
    <>
      {modalType === "login" && (
        <LoginModal isOpen={true} onClose={closeModal} />
      )}
      {modalType === "signup" && (
        <SignupModal isOpen={true} onClose={closeModal} />
      )}
    </>
  );
}
