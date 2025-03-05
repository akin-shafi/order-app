// app/store/layout.tsx
import { Suspense } from "react";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
