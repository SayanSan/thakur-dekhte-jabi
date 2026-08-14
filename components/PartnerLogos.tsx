"use client";

import Image from "next/image";

/** Onyo Puja + Offbeat CCU — intended for top-left placement */
export function LeftLogos() {
  return (
    <div className="flex items-center gap-4 sm:gap-5 px-2 py-1">
      <Image
        src="/onnya-pujo-logo.png"
        alt="Onyo Pujo Logo"
        width={140}
        height={40}
        className="h-9 sm:h-10 object-contain opacity-85 hover:opacity-100 transition-opacity duration-300"
      />
      <div className="h-8 w-px bg-[#c9a35e]/25" />
      <Image
        src="/offbeat-horizontal-logo.png"
        alt="Offbeat CCU Logo"
        width={180}
        height={60}
        className="h-16 sm:h-20 max-w-[140px] sm:max-w-[160px] object-contain opacity-85 hover:opacity-100 transition-opacity duration-300"
      />
    </div>
  );
}

/** MCRA + Smiley (CCU App) — intended for top-right placement */
export function RightLogos() {
  return (
    <div className="flex items-center gap-4 sm:gap-5 px-2 py-1">
      <Image
        src="/mcra-logo.png"
        alt="Make Calcutta Relevant Again Logo"
        width={180}
        height={60}
        className="h-16 sm:h-20 max-w-[140px] sm:max-w-[160px] object-contain opacity-85 hover:opacity-100 transition-opacity duration-300"
      />
      <div className="h-8 w-px bg-[#c9a35e]/25" />
      <Image
        src="/smiley-logo.jpg"
        alt="CCU App Smiley Logo"
        width={40}
        height={40}
        className="h-8 sm:h-9 rounded-full aspect-square object-contain opacity-85 hover:opacity-100 transition-opacity duration-300"
      />
    </div>
  );
}

/** All four logos together (used on arrival page where space is limited) */
export default function PartnerLogos() {
  return (
    <div className="flex items-center gap-4 sm:gap-5 flex-wrap justify-center">
      <LeftLogos />
      <RightLogos />
    </div>
  );
}
