"use client";

import Image from "next/image";

export default function PartnerLogos() {
  const logos = [
    { src: "/onnya-pujo-logo.png", alt: "Onyo Pujo Logo", width: 140, height: 40, className: "h-9 sm:h-10" },
    { src: "/mcra-logo.png", alt: "Make Calcutta Relevant Again Logo", width: 180, height: 60, className: "h-16 sm:h-20 max-w-[140px] sm:max-w-[160px]" },
    { src: "/offbeat-horizontal-logo.png", alt: "Offbeat CCU Logo", width: 180, height: 60, className: "h-16 sm:h-20 max-w-[140px] sm:max-w-[160px]" },
    { src: "/smiley-logo.jpg", alt: "Partner Smiley Logo", width: 40, height: 40, className: "h-8 sm:h-9 rounded-full aspect-square" },
  ];

  return (
    <div className="flex items-center gap-5 sm:gap-7 rounded-full border border-[#c9a35e]/30 bg-[#0d0914]/80 px-6 py-2 shadow-lg backdrop-blur-md">
      {logos.map((logo, idx) => (
        <div key={idx} className="flex items-center">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className={`object-contain opacity-85 hover:opacity-100 transition-opacity duration-300 ${logo.className}`}
          />
          {idx < logos.length - 1 && (
            <div className="ml-5 sm:ml-7 h-8 w-px bg-[#c9a35e]/25" />
          )}
        </div>
      ))}
    </div>
  );
}
