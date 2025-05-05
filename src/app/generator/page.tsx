"use client";

import { Player, PlayerRef } from "@remotion/player";
import type { NextPage } from "next";
import React, { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  CompositionProps,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../../types/constants";
import OneOnOne from "../../components/results/OneOnOne";
import { ResultsList } from "../../components/results/ResultsList";
import { processMatchResults } from "../../lib/utils/extractSailorNames";
import Link from "next/link";

// Placeholder - Define or import properly later
type MatchResult = {
  winner: string;
  loser: string;
  flight: number;
  match: number;
};

// Helper component to access search params, because hooks can only be called inside components
function GeneratorPageContent() {
  const searchParams = useSearchParams();
  const previewUrl = searchParams.get("previewUrl");
  const fromView = searchParams.get("fromView");

  const [inputProps, setInputProps] =
    useState<z.infer<typeof CompositionProps>>(defaultMyCompProps);
  const [url] = useState<string>(previewUrl || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const playerRef = useRef<PlayerRef>(null);
  const [bgVideoSrc, setBgVideoSrc] = useState<string>(
    "https://www.kwmedia.klockworks.xyz/projects/wmrt-results-generator/bg-videos/wmrt-bg-01.mp4",
  );

  const backLinkHref = fromView === "allEvents" ? "/?view=allEvents" : "/";

  useEffect(() => {
    if (previewUrl) {
      handleGetResults();
    }
  }, [previewUrl]);

  const fetchResults = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/fetchMatchracingresults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url + "feed.php?showall=true" }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await response.json();
      const sailorData = processMatchResults(data);
      if (sailorData.length === 0) {
        return null;
      } else {
        return sailorData;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.log(error);
      return null;
    } finally {
      console.log("finally");
      setIsLoading(false);
    }
  };

  const handleGetResults = async () => {
    const sailorData = await fetchResults();
    if (sailorData) {
      setResults(sailorData);
      handleSelectResult(sailorData[0]);
    }
  };

  const handleSelectResult = (result: MatchResult) => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }

    const setRandomVideoBg = () => {
      const randomVideoNumber = Math.floor(Math.random() * 5) + 1;
      const randomVideo = `https://www.kwmedia.klockworks.xyz/projects/wmrt-results-generator/bg-videos/wmrt-bg-0${randomVideoNumber}.mp4`;
      if (bgVideoSrc !== randomVideo) {
        setBgVideoSrc(randomVideo);
      } else {
        setRandomVideoBg();
      }
      return randomVideo;
    };

    setRandomVideoBg();

    setInputProps({
      ...inputProps,
      winner: result.winner,
      loser: result.loser,
      flight: result.flight,
      match: result.match,
      bgVideoSrc: bgVideoSrc,
    });
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex md:items-center md:justify-center bg-gray-900 text-white relative p-4">
      {previewUrl && (
        <div className="absolute top-4 left-4 z-10">
          <Link
            href={backLinkHref}
            className="text-blue-400 hover:text-blue-300 hover:underline flex items-center text-sm bg-gray-800/70 px-3 py-1 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Admin Dashboard
          </Link>
        </div>
      )}

      <div className="flex flex-col-reverse md:flex-row w-full max-w-6xl gap-8 mt-12 md:mt-0">
        <div>
          <h2 className="text-white text-xl font-bold pl-4 mb-2">
            Match Results
          </h2>
          <div className="w-full max-h-[80vh] overflow-y-auto p-4 bg-gray-800 rounded-2xl shadow-lg scrollbar">
            {results.length > 0 ? (
              <ResultsList
                results={results}
                onSelectResult={handleSelectResult}
              />
            ) : (
              <div className="text-center p-8 text-gray-400">
                {isLoading ? "Loading results..." : "No results loaded yet."}
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <div className="w-2/3 md:w-full aspect-[9/16] rounded-2xl shadow-lg overflow-hidden">
            {results.length > 0 ? (
              <Player
                ref={playerRef}
                component={OneOnOne}
                inputProps={inputProps}
                durationInFrames={DURATION_IN_FRAMES}
                fps={VIDEO_FPS}
                compositionHeight={VIDEO_HEIGHT}
                compositionWidth={VIDEO_WIDTH}
                style={{ width: "100%", height: "100%" }}
                controls
                autoPlay
                loop
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white p-4">
                <h2 className="text-xl md:text-2xl mb-2 text-center">
                  {(() => {
                    if (isLoading) {
                      return "Loading Preview...";
                    } else if (results.length > 0) {
                      return "Initializing Player...";
                    } else {
                      return "Select a result to preview";
                    }
                  })()}
                </h2>
                {!isLoading && results.length === 0 && (
                  <p className="text-md text-gray-400 text-center">
                    If you provided a URL, results should load automatically.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const GeneratorPage: NextPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GeneratorPageContent />
    </Suspense>
  );
};

export default GeneratorPage;
