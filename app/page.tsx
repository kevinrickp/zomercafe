"use client";

import { useEffect, useState } from "react";

const backgrounds = [
  "/images/zomer1.jpg",
  "/images/zomer2.jpg",
  "/images/zomer3.jpg",
];

export default function HomePage() {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-full h-screen flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: `url(${backgrounds[bgIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 1s ease-in-out",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-w-2xl px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to Zomer Cafe
        </h1>
        <p className="text-lg md:text-xl font-medium drop-shadow-md">
          Discover cozy ambiance, curated menus, and memorable experiences at
          your favorite chill spot.
        </p>
      </div>
    </section>
  );
}
