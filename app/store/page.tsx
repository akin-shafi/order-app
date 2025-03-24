// app/store/page.tsx
import StoreContent from "./StoreContent";
import QueryProvider from "@/components/providers/QueryProvider";

export default function StorePage() {
  return (
    <QueryProvider>
      <StoreContent />
    </QueryProvider>
  );
}
