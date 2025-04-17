"use client";

import React, { useEffect, useRef } from "react";
import { AbsoluteFill } from "remotion";
import { Lottie } from "@remotion/lottie";
import animationData from "../../../public/lottie/wmrt-test-03.json";
import { AnimationItem } from "lottie-web";

interface LottieAnimationProps {
  sailor1: string;
  sailor2: string;
}

interface TextLayerData {
  t: {
    d: {
      k: Array<{
        s: {
          t: string;
        };
      }>;
    };
  };
}

interface LottieLayer {
  data: {
    nm: string;
  };
  updateDocumentData: (data: TextLayerData) => void;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  sailor1,
  sailor2,
}) => {
  const lottieRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (lottieRef.current) {
      if (sailor1) {
        lottieRef.current.goToAndStop(0, true);
        const layer = lottieRef.current.renderer.elements.find(
          (el: LottieLayer) => el.data.nm === "ANTON",
        );
        if (layer) {
          layer.updateDocumentData({
            t: {
              d: {
                k: [
                  {
                    s: {
                      t: sailor1,
                    },
                  },
                ],
              },
            },
          });
        }
      }
      if (sailor2) {
        lottieRef.current.goToAndStop(0, true);
        const layer = lottieRef.current.renderer.elements.find(
          (el: LottieLayer) => el.data.nm === "KLOCK",
        );
        if (layer) {
          layer.updateDocumentData({
            t: {
              d: {
                k: [
                  {
                    s: {
                      t: sailor2,
                    },
                  },
                ],
              },
            },
          });
        }
      }
    }
  }, [sailor1, sailor2]);

  return (
    <AbsoluteFill>
      <Lottie
        animationData={animationData}
        style={{
          width: "100%",
          height: "100%",
        }}
        onAnimationLoaded={(animation) => {
          lottieRef.current = animation;
        }}
      />
    </AbsoluteFill>
  );
};

export default LottieAnimation;
