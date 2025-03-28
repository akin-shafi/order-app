"use client";

import React from "react";
// import HeaderStore from "@/components/HeaderStore";
import CartModal from "@/components/cart/CartModal";
import { useHeaderStore } from "@/stores/header-store";
import ModalContainer from "@/components/auth/modal-container";
import InstallAppPrompt from "@/components/InstallAppPrompt";
import { ToastContainer } from "react-toastify";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { isCartOpen, setCartOpen } = useHeaderStore();

  return (
    <>
      {/* <HeaderStore /> */}
      {children}
      <CartModal isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
      <ModalContainer />
      <InstallAppPrompt />
      <ToastContainer position="top-right" autoClose={1000} />
    </>
  );
}
