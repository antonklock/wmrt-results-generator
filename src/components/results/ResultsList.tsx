import React, { useEffect } from "react";
import { ResultListItem } from "./ResultListItem";

interface ResultsListProps {
  results: Array<{
    sailor1: string;
    sailor2: string;
  }>;
  onSelectResult: (result: MatchResult) => void;
}

export const ResultsList: React.FC<ResultsListProps> = ({
  results,
  onSelectResult,
}) => {
  useEffect(() => {
    console.log("results", results);
  }, [results]);
  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <h2 className="text-white text-xl font-bold">Match Results</h2>
      <div className="flex flex-col gap-2">
        {results.map((result, index) => (
          <ResultListItem
            key={index + result.sailor1 + result.sailor2}
            result={result}
            onClick={() => onSelectResult(result)}
          />
        ))}
      </div>
    </div>
  );
};
