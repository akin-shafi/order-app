// components/Header.tsx
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ShoppingCart,
  ChevronDown,
  Home,
  Info,
  HelpCircle,
  Phone,
  User,
  Utensils,
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const mobileMenuItems = [
    {
      name: "Products",
      icon: <Home size={20} />,
      dropdown: ["BetaSpoon", "ShipazDay"],
      href: "/products",
    },
    {
      name: "Know Us",
      icon: <Info size={20} />,
      href: "/know-us",
    },
    {
      name: "FAQs",
      icon: <HelpCircle size={20} />,
      href: "/faqs",
    },
    {
      name: "Contact",
      icon: <Phone size={20} />,
      href: "/contact",
    },
    {
      name: "Become a vendor",
      icon: <Utensils size={20} />,
      href: "/become-a-vendor",
    },
    {
      name: "Become a Rider",
      icon: <User size={20} />,
      href: "/become-a-rider",
    },
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 bg-transparent px-4 sm:px-6 md:px-12 flex items-center justify-between">
      {/* Logo with dark background */}
      <div className="bg-[#210603] p-3 rounded-lg">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Palapolo Logo"
            width={70}
            height={70}
            className="filter brightness-0 invert"
          />
        </Link>
      </div>

      {/* Navigation menu with white background */}
      <nav className="hidden md:flex bg-white rounded-full px-4 py-4 shadow-sm flex items-center gap-6">
        {/* Products Dropdown */}
        <div className="relative group">
          <button className="text-[#461914] hover:text-[#f15736]  text-sm font-medium transition-colors flex items-center gap-1">
            Products
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {/* <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all delay-100"></div> */}
          <div className="absolute top-full left-0 mt-5 w-40 bg-white shadow-lg rounded-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all delay-100">
            <Link
              href="/betaspoon"
              className="block px-4 py-2 text-sm text-[#461914] hover:bg-[#fff2f1] hover:text-[#f15736] "
            >
              BetaSpoon
            </Link>
            <Link
              href="/shipazday"
              className="block px-4 py-2 text-sm text-[#461914] hover:bg-[#fff2f1] hover:text-[#f15736] "
            >
              ShipazDay
            </Link>
          </div>
        </div>

        {[
          { name: "Know Us", href: "/know-us" },
          { name: "FAQs", href: "/faqs" },
          { name: "Contact Us", href: "/contact" },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-[#461914] hover:text-[#f15736]  text-sm font-medium transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-4">
        {/* Partners Dropdown */}
        <div className="relative group">
          <button className="bg-white text-[#461914] hover:text-[#f15736] px-4 py-4 text-sm font-medium rounded-full flex items-center gap-1 transition-colors">
            Partners
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all delay-100">
            <Link
              href="/vendor"
              className="block px-4 py-2 text-sm text-[#461914] hover:bg-[#fff2f1] hover:text-[#f15736]"
            >
              Become a vendor
            </Link>
            <Link
              href="/rider"
              className="block px-4 py-2 text-sm text-[#461914] hover:bg-[#fff2f1] hover:text-[#f15736]"
            >
              Become a Rider
            </Link>
          </div>
        </div>

        {/* Cart Icon */}
        <Link
          href="/store"
          className="bg-white p-3 rounded-full text-[#461914] hover:text-[#f15736]"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </Link>
      </div>

      {/* Mobile Controls (Hidden on Desktop) */}
      <div className="flex items-center gap-4 md:hidden">
        <Link href="/cart" className="bg-white p-2 rounded-full text-[#461914]">
          <ShoppingCart size={24} />
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-white p-2 rounded-full text-[#461914]"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform z-50
        ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:hidden`}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#461914] mb-6 flex items-center gap-2">
            <Menu size={24} /> Menu
          </h2>

          <nav className="space-y-4">
            {mobileMenuItems.map((item) => (
              <div key={item.name} className="border-b border-[#f1f1f1] pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.dropdown ? (
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === item.name ? null : item.name
                          )
                        }
                        className="text-[#461914] hover:text-[#f15736] flex items-center gap-2"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-[#461914] hover:text-[#f15736]"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                  {item.dropdown && (
                    <ChevronDown
                      className={`transform transition-transform ${
                        openDropdown === item.name ? "rotate-180" : ""
                      }`}
                      size={16}
                    />
                  )}
                </div>

                {item.dropdown && openDropdown === item.name && (
                  <div className="ml-8 mt-2 space-y-2">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem}
                        href="#"
                        className="block text-sm text-[#461914] hover:text-[#f15736]"
                      >
                        {subItem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
