// components/Header.tsx
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-[#ffecd8] py-4 px-4 sm:px-6 md:px-12 flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="Palapolo Logo"
          width={90}
          height={90}
          className="mt-2"
        />
      </Link>

      <nav className="hidden md:flex items-center gap-4 lg:gap-6">
        {["Know Us", "Become a rider", "Contact Us"].map((item) => (
          <Link
            key={item}
            href="#"
            className="text-[#461914] hover:text-[#6b2d23] text-sm lg:text-base"
          >
            {item}
          </Link>
        ))}
      </nav>

      <Link
        href="#"
        className="bg-[#210603] text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm"
      >
        Visit Store
      </Link>
    </header>
  );
}
