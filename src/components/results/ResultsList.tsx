import React, { useEffect } from "react";
import { ResultListItem } from "./ResultListItem";

interface ResultsListProps {
  results: Array<MatchResult>;
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
      <div className="flex flex-col gap-2">
        {results.map((result, index) => (
          <ResultListItem
            key={index + result.winner + result.loser}
            result={result}
            onClick={() => onSelectResult(result)}
          />
        ))}
      </div>
    </div>
  );
};
