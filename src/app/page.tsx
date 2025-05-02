"use client";

import { Player, PlayerRef } from "@remotion/player";
import type { NextPage } from "next";
import React, { useRef, useState } from "react";
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
import { ResultsList } from "../components/results/ResultsList";
import { processMatchResults } from "../lib/utils/extractSailorNames";

const Home: NextPage = () => {
  const [inputProps, setInputProps] =
    useState<z.infer<typeof CompositionProps>>(defaultMyCompProps);
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [invalidUrl, setInvalidUrl] = useState<boolean>(false);
  const playerRef = useRef<PlayerRef>(null);

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

    const getRandomVideo = () => {
      const randomVideo = Math.floor(Math.random() * 5) + 1;
      // return `/videos/wmrt-bg-0${randomVideo}.mp4`;
      return `https://www.kwmedia.klockworks.xyz/projects/wmrt-results-generator/bg-videos/wmrt-bg-0${randomVideo}.mp4`;
    };

    setInputProps({
      ...inputProps,
      winner: result.winner,
      loser: result.loser,
      flight: result.flight,
      match: result.match,
      bgVideoSrc: getRandomVideo(),
    });
  };

  const handleInvalidUrl = () => {
    setInvalidUrl(true);
    setTimeout(() => {
      setInvalidUrl(false);
    }, 3000);
  };

  return (
    <div>
      <div className="max-w-screen-md px-8 md-px-0 m-auto mb-5 mt-16">
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
              <p className="text-4xl text-white">
                Enter a URL to fetch results
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 justify-center items-center text-white">
          <div className="flex flex-col gap-2 w-full max-w-md">
            <div className="flex flex-col gap-2">
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
};

export default Home;
