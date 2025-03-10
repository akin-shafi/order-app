"use client";

import { motion } from "framer-motion";
import AnimatedBanner from "./AnimatedBanner";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const AdvertBanners = () => {
  const banners = [
    {
      imageUrl: "/images/advert-1.png",
      alt: "Chow Combo Offer",
      href: "/offers/special",
      bgColor: "bg-green-800",
    },
    {
      imageUrl: "/images/advert-2.png",
      alt: "Relay Package Delivery",
      href: "/restaurants/new",
      bgColor: "bg-red-900",
    },
  ];

  return (
    <div className="mt-2 container mx-auto px-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center"
      >
        {banners.map((banner, index) => (
          <AnimatedBanner key={banner.href} {...banner} delay={index * 0.2} />
        ))}
      </motion.div>
    </div>
  );
};

export default AdvertBanners;
