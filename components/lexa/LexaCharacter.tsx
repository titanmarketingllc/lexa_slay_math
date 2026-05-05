import Image from "next/image";

import { getLexaAsset, type LexaPose } from "@/src/data/lexaAssets";
import { cn } from "@/lib/utils";

type LexaCharacterProps = {
  pose?: LexaPose;
  size?: "sm" | "md" | "lg" | "hero";
  withGlow?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: "h-16 w-16",
  md: "h-28 w-28",
  lg: "h-52 w-52",
  hero: "h-[280px] w-[280px] sm:h-[360px] sm:w-[360px] lg:h-[460px] lg:w-[460px]",
};

export default function LexaCharacter({
  pose = "home",
  size = "lg",
  withGlow = true,
  className,
}: LexaCharacterProps) {
  const asset = getLexaAsset(pose);

  return (
    <div
      className={cn(
        "relative isolate flex shrink-0 items-center justify-center",
        sizeClasses[size],
        withGlow &&
          "before:absolute before:inset-3 before:-z-10 before:rounded-full before:bg-fuchsia-500/35 before:blur-3xl after:absolute after:inset-8 after:-z-10 after:rounded-full after:bg-cyan-300/35 after:blur-2xl",
        className,
      )}
    >
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        priority={size === "hero"}
        sizes={
          size === "hero"
            ? "(min-width: 1024px) 460px, (min-width: 640px) 360px, 280px"
            : "(min-width: 1024px) 220px, 120px"
        }
        className="object-contain drop-shadow-[0_18px_35px_rgba(236,72,153,0.45)]"
      />
    </div>
  );
}
