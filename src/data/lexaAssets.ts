export type LexaPose =
  | "home"
  | "avatar"
  | "fashion"
  | "gameplay"
  | "shop"
  | "celebrate"
  | "encourage";

export type LexaAsset = {
  src: string;
  alt: string;
};

export const lexaAssets = {
  keyArt: {
    src: "/assets/lexa/lexa-key-art.svg",
    alt: "Lexa in neon streetwear with a confident heroic pose",
  },
  logo: {
    src: "/assets/lexa/lexa-logo.svg",
    alt: "Lexa Slay neon logo",
  },
  silhouette: {
    src: "/assets/lexa/lexa-silhouette.svg",
    alt: "Lexa neon silhouette placeholder",
  },
  poses: {
    home: {
      src: "/assets/lexa/lexa-home.svg",
      alt: "Lexa welcoming players to the neon math quest",
    },
    avatar: {
      src: "/assets/lexa/lexa-avatar.svg",
      alt: "Lexa avatar with neon streaks and crown energy",
    },
    fashion: {
      src: "/assets/lexa/lexa-fashion.svg",
      alt: "Lexa fashion preview with neon outfit details",
    },
    gameplay: {
      src: "/assets/lexa/lexa-gameplay.svg",
      alt: "Lexa cheering during gameplay",
    },
    shop: {
      src: "/assets/lexa/lexa-shop.svg",
      alt: "Lexa presenting shop rewards and power-ups",
    },
    celebrate: {
      src: "/assets/lexa/lexa-key-art.svg",
      alt: "Lexa celebrating a completed level",
    },
    encourage: {
      src: "/assets/lexa/lexa-avatar.svg",
      alt: "Lexa giving an encouraging reaction",
    },
  } satisfies Record<LexaPose, LexaAsset>,
};

export function getLexaAsset(pose: LexaPose = "home") {
  return lexaAssets.poses[pose] ?? lexaAssets.keyArt;
}
