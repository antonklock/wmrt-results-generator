import { Composition } from "remotion";
import OneOnOne from "./OneOnOne";
import {
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  defaultMyCompProps,
} from "../../../types/constants";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="OneOnOne"
      component={OneOnOne}
      durationInFrames={DURATION_IN_FRAMES}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      defaultProps={defaultMyCompProps}
    />
  );
};
