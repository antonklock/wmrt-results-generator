import React, { useState } from "react";
import { AbsoluteFill, Img, Video, useCurrentFrame, spring } from "remotion";

const OneOnOne: React.FC = () => {
  const [sailor1, setSailor1] = useState<string>("Brady");
  const [sailor2, setSailor2] = useState<string>("Poole");
  const [number1, setNumber1] = useState<number>(1);
  const [number2, setNumber2] = useState<number>(0);

  const frame = useCurrentFrame();

  const titleSpring = spring({
    frame,
    fps: 30,
    from: -50,
    to: 0,
    config: {
      damping: 200,
    },
  });

  const sailor1Spring = spring({
    frame: frame - 10,
    fps: 30,
    from: -50,
    to: 0,
    config: {
      damping: 200,
    },
  });

  const sailor2Spring = spring({
    frame: frame - 20,
    fps: 30,
    from: -50,
    to: 0,
    config: {
      damping: 200,
    },
  });

  const logoSpring = spring({
    frame: frame,
    fps: 30,
    from: 0,
    to: 0,
    config: {
      damping: 200,
    },
  });

  const opacity = (delay: number) =>
    spring({
      frame: frame - delay,
      fps: 30,
      from: 0,
      to: 1,
      config: {
        damping: 200,
      },
    });

  return (
    <>
      <Video src="/videos/wmrt-bg-01.mp4" />
      <AbsoluteFill className="opacity-85 bg-[#0c2340] w-[1080px] h-[1920px]"></AbsoluteFill>
      <div className="absolute inset-0 text-white">
        <div className="flex flex-col items-center justify-between h-full w-full">
          <div className="flex flex-col items-center justify-center h-full w-full">
            <h1
              className="text-[30px] font-bold mb-8"
              style={{
                transform: `translateY(${titleSpring}px)`,
                opacity: opacity(0),
              }}
            >
              FLIGHT 1: MATCH 3
            </h1>
            <div className="flex flex-col items-center justify-center text-2xl">
              <p
                className="text-[80px] font-bold text-yellow-500"
                style={{
                  transform: `translateY(${sailor1Spring}px)`,
                  opacity: opacity(10),
                }}
              >
                {sailor1} <span className="text-white">{number1}</span>
              </p>
              <p
                className="text-[50px] font-bold"
                style={{
                  transform: `translateY(${sailor2Spring}px)`,
                  opacity: opacity(20),
                }}
              >
                {sailor2} <span className="text-white">{number2}</span>
              </p>
            </div>
          </div>
          <div
            className="mb-24"
            style={{
              transform: `translateY(${logoSpring}px)`,
              opacity: opacity(0),
            }}
          >
            <Img src="/images/wmrt-logo.png" className="w-[100px] h-[100px]" />
          </div>
        </div>
      </div>
    </>
  );
};

export default OneOnOne;
