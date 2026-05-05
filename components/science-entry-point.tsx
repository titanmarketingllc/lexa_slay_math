import Link from "next/link";
import { Atom, FlaskConical } from "lucide-react";

export default function ScienceEntryPoint() {
  return (
    <Link
      href="/science"
      className="fixed bottom-4 left-4 right-4 z-30 mx-auto flex max-w-xl items-center justify-between gap-4 rounded-[1.5rem] border border-cyan-300/30 bg-[#080013]/90 p-4 text-white shadow-[0_0_38px_rgba(34,211,238,0.28)] ring-1 ring-white/10 backdrop-blur md:left-auto md:right-6 md:max-w-md"
    >
      <span className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-cyan-300 text-slate-950">
          <FlaskConical className="h-6 w-6" />
        </span>
        <span>
          <span className="block text-xs font-black uppercase tracking-[0.18em] text-cyan-100">Science</span>
          <span className="block text-lg font-black">Science Slay Lab</span>
          <span className="block text-sm font-semibold text-white/65">Explore animals, energy, Earth, space, and matter.</span>
        </span>
      </span>
      <Atom className="h-7 w-7 text-amber-200" />
    </Link>
  );
}
