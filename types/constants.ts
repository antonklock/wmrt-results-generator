import { z } from "zod";
export const COMP_NAME = "MyComp";

export const CompositionProps = z.object({
  winner: z.string(),
  loser: z.string(),
  flight: z.number(),
  match: z.number(),
  number1: z.number(),
  number2: z.number(),
  bgVideoSrc: z.string(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  winner: "Klock",
  loser: "Poole",
  flight: 1,
  match: 1,
  number1: 1,
  number2: 0,
  bgVideoSrc: "https://www.kwmedia.klockworks.xyz/projects/wmrt-results-generator/bg-videos/wmrt-bg-01.mp4",
};

export const DURATION_IN_FRAMES = 449;
export const VIDEO_WIDTH = 720;
export const VIDEO_HEIGHT = 1280;
export const VIDEO_FPS = 30;
