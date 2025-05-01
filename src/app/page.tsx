"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React, { useState } from "react";
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

  const handleFetchResults = async () => {
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
      setResults(sailorData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectResult = (result: MatchResult) => {
    setInputProps({
      ...inputProps,
      sailor1: result.sailor1,
      sailor2: result.sailor2,
      flight: result.flight,
      match: result.match,
    });
  };

  return (
    <div>
      <div className="max-w-screen-md px-8 md-px-0 m-auto mb-5 mt-16">
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
          <div className="flex flex-col gap-2 w-full max-w-md">
            <div className="flex flex-col gap-2">
              <label htmlFor="url" className="text-white">
                Match Racing Results URL
              </label>
              <input
                id="url"
                className="bg-transparent border-1 border-white rounded-md p-2 w-full"
                type="text"
                placeholder="Enter match racing results URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button
              onClick={handleFetchResults}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Fetch Results"}
            </button>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
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
