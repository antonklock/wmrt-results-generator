import { useEffect, useRef } from "react";
import { AbsoluteFill, Img, Video, useCurrentFrame, spring } from "remotion";

const OneOnOne = ({
  winner,
  loser,
  flight,
  match,
  bgVideoSrc,
  setIsPlayerReady,
}: {
  winner: string;
  loser: string;
  flight: number;
  match: number;
  bgVideoSrc: string;
  setIsPlayerReady: (value: boolean) => void;
}) => {
  const frame = useCurrentFrame();
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const beatSpring = spring({
    frame: frame - 15,
    fps: 30,
    from: 0,
    to: 1,
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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener("canplay", () => {
        setIsPlayerReady(true);
      });
    }
  }, [setIsPlayerReady]);

  useEffect(() => {
    setIsPlayerReady(false);
  }, [bgVideoSrc, setIsPlayerReady]);

  return (
    <>
      <div className="fixed inset-0 w-full h-full flex justify-center items-center">
        <Video
          src={bgVideoSrc}
          className="w-full h-full object-cover"
          ref={videoRef}
        />
      </div>
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
              FLIGHT {flight}: MATCH {match}
            </h1>
            <div className="flex flex-col items-center justify-center text-2xl">
              <p
                className="text-[80px] font-bold text-yellow-500"
                style={{
                  transform: `translateY(${sailor1Spring}px)`,
                  opacity: opacity(10),
                }}
              >
                {winner}
              </p>
              <p
                className="text-white text-4xl my-8"
                style={{
                  transform: `scale(${beatSpring})`,
                  opacity: opacity(15),
                }}
              >
                Beat
              </p>
              <p
                className="text-[50px] font-bold"
                style={{
                  transform: `translateY(${sailor2Spring}px)`,
                  opacity: opacity(20),
                }}
              >
                {loser}
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
