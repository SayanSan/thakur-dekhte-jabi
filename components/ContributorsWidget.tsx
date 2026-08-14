"use client";

export default function ContributorsWidget() {
  return (
    <div className="pointer-events-auto flex flex-col gap-1.5 rounded-xl border border-[#c9a35e]/30 bg-[#0d0914]/85 p-3 text-[0.65rem] uppercase tracking-wider text-[#cbb9a8] backdrop-blur-md shadow-lg transition-all hover:border-[#c9a35e]/50">
      <p className="text-[0.55rem] text-[#c9a35e] font-bold tracking-[0.18em] mb-0.5">
        Contributors
      </p>
      <a
        href="https://www.linkedin.com/in/sayan-choudhury-356597155/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-[#f3ecdf] flex items-center gap-1 transition-colors"
      >
        <span>Sayan (Dev)</span>
        <span className="text-[0.5rem] opacity-60">↗</span>
      </a>
      <a
        href="https://www.linkedin.com/in/titas-bhattacharyya-386402267/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-[#f3ecdf] flex items-center gap-1 transition-colors"
      >
        <span>Titas (Curator)</span>
        <span className="text-[0.5rem] opacity-60">↗</span>
      </a>
    </div>
  );
}
