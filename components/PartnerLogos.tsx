"use client";

import Image from "next/image";

export default function PartnerLogos() {
  const logos = [
    { src: "/onnya-pujo-logo.png", alt: "Onyo Pujo Logo", width: 140, height: 40 },
    { src: "/mcra-logo.png", alt: "Make Calcutta Relevant Again Logo", width: 130, height: 40 },
    { src: "/offbeat-horizontal-logo.png", alt: "Offbeat CCU Logo", width: 130, height: 40 },
    { src: "/smiley-logo.jpg", alt: "Partner Smiley Logo", width: 40, height: 40, isSmiley: true },
  ];

  return (
    <div className="flex items-center gap-5 sm:gap-7 rounded-full border border-[#c9a35e]/30 bg-[#0d0914]/80 px-6 py-2.5 shadow-lg backdrop-blur-md">
      {logos.map((logo, idx) => (
        <div key={idx} className="flex items-center">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className={`object-contain h-9 sm:h-10 w-auto opacity-85 hover:opacity-100 transition-opacity duration-300 ${
              logo.isSmiley ? "rounded-full aspect-square" : ""
            }`}
          />
          {idx < logos.length - 1 && (
            <div className="ml-5 sm:ml-7 h-6 w-px bg-[#c9a35e]/25" />
          )}
        </div>
      ))}
    </div>
  );
}
