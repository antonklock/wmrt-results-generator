"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React, { useMemo, useState } from "react";
import { z } from "zod";
import {
  CompositionProps,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import OneOnOne from "../components/results/OneOnOne";

const Home: NextPage = () => {
  // const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
  //   return {
  //     sailor1: "Brady",
  //     sailor2: "Poole",
  //     number1: 1,
  //     number2: 0,
  //   };
  // }, []);

  const [inputProps, setInputProps] =
    useState<z.infer<typeof CompositionProps>>(defaultMyCompProps);

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5 mt-16">
        <div className="flex justify-center mb-10 rounded-2xl">
          <div className="w-[50%]">
            <Player
              component={OneOnOne}
              inputProps={inputProps}
              durationInFrames={DURATION_IN_FRAMES}
              fps={VIDEO_FPS}
              compositionHeight={VIDEO_HEIGHT}
              compositionWidth={VIDEO_WIDTH}
              style={{ width: "100%" }}
              controls
              autoPlay
              loop
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center text-white">
          <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="sailor1" className="text-white">
                  Sailor 1
                </label>
                <input
                  id="sailor1"
                  className="bg-transparent border-1 border-white rounded-md p-2"
                  type="text"
                  value={inputProps.sailor1}
                  onChange={(e) =>
                    setInputProps({ ...inputProps, sailor1: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="sailor2" className="text-white">
                  Sailor 2
                </label>
                <input
                  id="sailor2"
                  className="bg-transparent border-1 border-white rounded-md p-2"
                  type="text"
                  value={inputProps.sailor2}
                  onChange={(e) =>
                    setInputProps({ ...inputProps, sailor2: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="number1" className="text-white">
                  Number 1
                </label>
                <input
                  id="number1"
                  className="bg-transparent border-1 border-white rounded-md p-2"
                  type="number"
                  value={inputProps.number1}
                  onChange={(e) =>
                    setInputProps({
                      ...inputProps,
                      number1: parseInt(e.target.value),
                    })
                  }
                />
                <label htmlFor="number2" className="text-white">
                  Number 2
                </label>
                <input
                  id="number2"
                  className="bg-transparent border-1 border-white rounded-md p-2"
                  type="number"
                  value={inputProps.number2}
                  onChange={(e) =>
                    setInputProps({
                      ...inputProps,
                      number2: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
        {/* <RenderControls
          text={text}
          setText={setText}
          inputProps={inputProps}
        ></RenderControls> */}
      </div>
    </div>
  );
};

export default Home;
