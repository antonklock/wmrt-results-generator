import { z } from "zod";
export const COMP_NAME = "MyComp";

export const CompositionProps = z.object({
  sailor1: z.string(),
  sailor2: z.string(),
  flight: z.number(),
  match: z.number(),
  number1: z.number(),
  number2: z.number(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  sailor1: "Klock",
  sailor2: "Poole",
  flight: 1,
  match: 1,
  number1: 1,
  number2: 0,
};

export const DURATION_IN_FRAMES = 449;
export const VIDEO_WIDTH = 720;
export const VIDEO_HEIGHT = 1280;
export const VIDEO_FPS = 30;
