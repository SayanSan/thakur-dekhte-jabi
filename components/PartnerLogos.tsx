"use client";

import Image from "next/image";

export default function PartnerLogos() {
  const logos = [
    { src: "/onnya-pujo-logo.png", alt: "Onyo Pujo Logo", width: 90, height: 26 },
    { src: "/mcra-logo.png", alt: "Make Calcutta Relevant Again Logo", width: 85, height: 26 },
    { src: "/offbeat-horizontal-logo.png", alt: "Offbeat CCU Logo", width: 85, height: 26 },
    { src: "/smiley-logo.jpg", alt: "Partner Smiley Logo", width: 26, height: 26, isSmiley: true },
  ];

  return (
    <div className="flex items-center gap-4 sm:gap-6 rounded-full border border-[#c9a35e]/30 bg-[#0d0914]/80 px-5 py-2 shadow-lg backdrop-blur-md">
      {logos.map((logo, idx) => (
        <div key={idx} className="flex items-center">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className={`object-contain h-6 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300 ${
              logo.isSmiley ? "rounded-full" : ""
            }`}
          />
          {idx < logos.length - 1 && (
            <div className="ml-4 sm:ml-6 h-4 w-px bg-[#c9a35e]/25" />
          )}
        </div>
      ))}
    </div>
  );
}
