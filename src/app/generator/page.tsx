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

  const [inputProps, setInputProps] =
    useState<z.infer<typeof CompositionProps>>(defaultMyCompProps);
  const [url, setUrl] = useState<string>(previewUrl || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [invalidUrl, setInvalidUrl] = useState<boolean>(false);
  const playerRef = useRef<PlayerRef>(null);
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);
  const [bgVideoSrc, setBgVideoSrc] = useState<string>(
    "https://www.kwmedia.klockworks.xyz/projects/wmrt-results-generator/bg-videos/wmrt-bg-01.mp4",
  );

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
        handleInvalidUrl();
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
      return null;
    } finally {
      console.log("finally");
      setIsLoading(false);
    }
  };

  const handleGetResults = async () => {
    setIsPlayerReady(false);

    const sailorData = await fetchResults();
    if (sailorData) {
      setResults(sailorData);
      handleSelectResult(sailorData[0]);
    } else {
      handleInvalidUrl();
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

  const handleInvalidUrl = () => {
    setInvalidUrl(true);
    setTimeout(() => {
      setInvalidUrl(false);
    }, 3000);
  };

  useEffect(() => {
    if (playerRef.current) {
      if (isPlayerReady) {
        playerRef.current.seekTo(0);
        playerRef.current.play();
      } else {
        playerRef.current.seekTo(0);
        playerRef.current.pause();
      }
    }
  }, [isPlayerReady]);

  useEffect(() => {
    console.log("isPlayerReady", isPlayerReady);
  }, [isPlayerReady]);

  return (
    <div>
      <div className="max-w-screen-md px-8 md:px-0 m-auto mb-5 mt-8">
        {previewUrl && (
          <div className="mb-4">
            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center"
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

        <div className="flex justify-center mb-10 rounded-2xl">
          {results.length > 0 ? (
            <div className="w-[50%]">
              <Player
                ref={playerRef}
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
          ) : (
            <div>
              <h1 className="text-4xl text-white mb-4">Results Generator</h1>
              <p className="text-xl text-white">
                {isLoading
                  ? "Loading Preview..."
                  : "Enter a URL to fetch results"}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 justify-center items-center text-white">
          <div className="flex flex-col gap-2 w-full max-w-md">
            <div className="flex flex-col gap-2">
              <label htmlFor="url" className="sr-only">
                Event URL
              </label>
              <input
                id="url"
                className="bg-transparent border-1 border-white rounded-md p-2 w-full"
                style={{
                  borderColor: invalidUrl ? "red" : "white",
                }}
                type="text"
                placeholder="Enter url from matchracingresults.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            {invalidUrl && (
              <p className="text-red-500 text-sm mt-2 font-bold">Invalid URL</p>
            )}
            {error && invalidUrl && (
              <div className="text-red-500 text-sm -mt-2">{error}</div>
            )}
            <button
              onClick={handleGetResults}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Fetch Results"}
            </button>
            {results.length > 0 && (
              <ResultsList
                results={results}
                onSelectResult={handleSelectResult}
              />
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
