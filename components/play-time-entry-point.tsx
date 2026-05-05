import Link from "next/link";
import { Gamepad2, Sparkles } from "lucide-react";

export default function PlayTimeEntryPoint() {
  return (
    <Link
      href="/play-time"
      className="fixed bottom-32 left-4 right-4 z-30 mx-auto flex max-w-xl items-center justify-between gap-4 rounded-[1.5rem] border border-fuchsia-300/30 bg-[#080013]/90 p-4 text-white shadow-[0_0_38px_rgba(236,72,153,0.28)] ring-1 ring-white/10 backdrop-blur md:bottom-36 md:left-auto md:right-6 md:max-w-md"
    >
      <span className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-fuchsia-400 text-white">
          <Gamepad2 className="h-6 w-6" />
        </span>
        <span>
          <span className="block text-xs font-black uppercase tracking-[0.18em] text-fuchsia-100">Play Time</span>
          <span className="block text-lg font-black">Fun mini-games with brainy rewards.</span>
          <span className="block text-sm font-semibold text-white/65">Run, match, tap, and slay quick challenges.</span>
        </span>
      </span>
      <Sparkles className="h-7 w-7 text-amber-200" />
    </Link>
  );
}
