import tesseractImg from "../assets/projects/tesseract.webp";
import keystrokeImg from "../assets/projects/keystroke.webp";
import spellboardImg from "../assets/projects/spellboard.webp";
import fuseImg from "../assets/projects/fuse.webp";
import smartKnobImg from "../assets/projects/smart-knob.webp";
import compressionImg from "../assets/projects/compression.webp";

import badgeTesseract from "../assets/icons/badge-tesseract.svg";
import badgeKeystroke from "../assets/icons/badge-keystroke.svg";
import badgeSpellboard from "../assets/icons/badge-spellboard.svg";
import badgeFuse from "../assets/icons/badge-fuse.svg";
import badgeSmartKnob from "../assets/icons/badge-smart-knob.svg";
import badgeCompression from "../assets/icons/badge-compression.svg";

import iconAiTesseract from "../assets/icons/icon-ai-tesseract.svg";
import iconAiFuse from "../assets/icons/icon-ai-fuse.svg";
import iconHardware from "../assets/icons/icon-hardware.svg";
import iconGame from "../assets/icons/icon-game.svg";

/**
 * How the photo sits inside the card's picture frame.
 * - "fill" / "cover": CSS object-fit on the frame box.
 * - crop: the image is scaled/offset (percentages of the frame box), matching the Figma crop.
 */
export type ImageFit =
  | "fill"
  | "cover"
  | { width: number; height: number; left: number; top: number };

export type Project = {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  /** Intrinsic pixel size of the image file (for width/height attributes). */
  imageSize: [number, number];
  imageAlt: string;
  imageFit: ImageFit;
  /** Card background: radial gradient color stops [color, offset 0–1]. */
  gradient: [string, number][];
  badge: string;
  icon: string;
  iconLabel: string;
  /**
   * Shown as a small sticker on the card. The icon is a vector (not an emoji) so it stays
   * crisp while the card scales in and out of the modal.
   */
  award?: { icon: "trophy" | "silver"; label: string };
  /** Outbound links. Each button in the modal only renders when its URL is set. */
  demoUrl?: string;
  repoUrl?: string;
  writeupUrl?: string;
};

export const GITHUB_PROFILE = "https://github.com/crkalapat/";

export const projects: Project[] = [
  {
    id: "tesseract",
    title: "Tesseract",
    date: "11.2026",
    description:
      "Tesseract is an open-source AI smart speaker I designed and built, from the custom PCB to the 3D-printed case. Say the wake word and it plays music, answers questions, or hands harder tasks to my AI agent, like adding deadlines to my calendar.",
    image: tesseractImg,
    imageSize: [1200, 910],
    imageAlt:
      "Tesseract, a black cube-shaped smart speaker with a small clock display",
    imageFit: { width: 100.03, height: 105.71, left: -0.02, top: 0 },
    gradient: [
      ["rgb(151,196,234)", 0],
      ["rgb(116,184,229)", 0.25],
      ["rgb(80,171,223)", 0.5],
      ["rgb(45,159,218)", 0.75],
      ["rgb(27,152,215)", 0.875],
      ["rgb(9,146,212)", 1],
    ],
    badge: badgeTesseract,
    icon: iconAiTesseract,
    iconLabel: "AI",
    demoUrl: "https://youtu.be/WYpaCrV-wes",
    repoUrl: "https://github.com/crkalapat/tesseract",
  },
  {
    id: "keystroke",
    title: "Keystroke",
    date: "07.2026",
    description:
      "Keystroke is a mini piano arcade game inspired by Grand Piano Keys, built in 72 hours at a San Francisco hardware hackathon and one of five winning projects. I came up with the idea and designed the gameplay, modeled the arcade cabinet in CAD, and directed AI to write the code.",
    image: keystrokeImg,
    imageSize: [1024, 768],
    imageAlt: "Keystroke, a small arcade cabinet with a screen and piano keys",
    imageFit: "fill",
    gradient: [
      ["rgb(251,137,118)", 0],
      ["rgb(240,110,91)", 0.5],
      ["rgb(229,82,63)", 1],
    ],
    badge: badgeKeystroke,
    icon: iconGame,
    iconLabel: "Game",
    award: { icon: "trophy", label: "Hack Club Outpost Winner" },
    demoUrl: "https://youtu.be/X3vovd0zBho",
    repoUrl: "https://github.com/hephaestushex/keystroke",
  },
  {
    id: "spellboard",
    title: "Spellboard",
    date: "06.2025",
    description:
      "Spellboard is a large, custom keyboard I built for my brother, who spells by pointing to letters. It keeps his letterboard’s alphabetical layout but types straight into a computer, using QMK firmware and a 3D-printed case. I shared units with two communication centers to try.",
    image: spellboardImg,
    imageSize: [1200, 900],
    imageAlt:
      "Spellboard, a black keyboard with large alphabetically ordered keys",
    imageFit: "cover",
    gradient: [
      ["rgb(246,234,175)", 0],
      ["rgb(246,228,131)", 0.5],
      ["rgb(245,221,87)", 1],
    ],
    badge: badgeSpellboard,
    icon: iconHardware,
    iconLabel: "Hardware",
    demoUrl:
      "https://github.com/user-attachments/assets/92936077-01a1-442b-ba66-4622e2b436ea",
    repoUrl: "https://github.com/crkalapat/spellboard",
  },
  {
    id: "fuse",
    title: "Fuse",
    date: "03.2025",
    description:
      "Fuse is an AI circuit analyzer. Snap a photo of a breadboard, and a custom-trained YOLOv11 model finds the parts while GPT explains the circuit and suggests fixes. Built with a teammate at HackMIT Blueprint 2025, where it won 2nd place. I built the front end and pitched the demo.",
    image: fuseImg,
    imageSize: [1000, 1000],
    imageAlt:
      "A breadboard circuit with resistors detected and labeled by Fuse",
    imageFit: "fill",
    gradient: [
      ["rgb(186,189,222)", 0],
      ["rgb(162,145,196)", 0.5],
      ["rgb(137,100,169)", 1],
    ],
    badge: badgeFuse,
    icon: iconAiFuse,
    iconLabel: "AI",
    award: { icon: "silver", label: "2nd place, HackMIT Blueprint" },
    demoUrl: "https://www.youtube.com/watch?v=rEFft3jJLJg",
    repoUrl: "https://github.com/crkalapat/fuse",
  },
  {
    id: "smart-knob",
    title: "Smart Knob",
    date: "08.2024",
    description:
      "Smart Knob is a motorized add-on that locks a regular door knob and works with Alexa and Google Home through Matter. It was my first hardware project. I designed the 3D-printed housing, programmed it in C++ using Matter’s example code, and showed it at Open Sauce 2026.",
    image: smartKnobImg,
    imageSize: [1024, 768],
    imageAlt: "Smart Knob, a 3D-printed motor housing mounted on a door knob",
    imageFit: "fill",
    gradient: [
      ["rgb(116,219,142)", 0],
      ["rgb(89,206,118)", 0.25],
      ["rgb(63,193,94)", 0.5],
      ["rgb(36,180,70)", 0.75],
      ["rgb(22,174,58)", 0.875],
      ["rgb(9,167,46)", 1],
    ],
    badge: badgeSmartKnob,
    icon: iconHardware,
    iconLabel: "Hardware",
    demoUrl:
      "https://github.com/user-attachments/assets/36e633b3-c66b-4fb2-a72d-89f20589ac2b",
    repoUrl: "https://github.com/crkalapat/smart-door-knob",
  },
  {
    id: "compression",
    title: "Compression",
    date: "03.2024",
    description:
      "Compression is a multiplayer combat game you play in the browser by stomping on opponents. My team built it at HackMIT Blueprint 2024, my first hackathon. I set up the project and build tools, and wrote the player controls for the game to receive user input.",
    image: compressionImg,
    imageSize: [926, 698],
    imageAlt:
      "Compression gameplay: two square characters on a grassy platform",
    imageFit: { width: 118.41, height: 125.09, left: -18.41, top: -16.37 },
    gradient: [
      ["rgb(239,202,157)", 0],
      ["rgb(238,175,100)", 0.5],
      ["rgb(237,162,71)", 0.75],
      ["rgb(236,148,42)", 1],
    ],
    badge: badgeCompression,
    icon: iconGame,
    iconLabel: "Game",
    demoUrl: "https://plutolotyl.itch.io/blueprint-demo-2",
    repoUrl: "https://github.com/crkalapat/compression",
  },
];

export function gradientCss(stops: Project["gradient"]): string {
  const s = stops.map(([c, o]) => `${c} ${o * 100}%`).join(", ");
  return `radial-gradient(50% 50% at 50% 50%, ${s})`;
}
