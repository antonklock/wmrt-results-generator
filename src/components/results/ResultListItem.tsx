import React from "react";

interface ResultListItemProps {
  result: MatchResult;
  onClick: () => void;
}

export const ResultListItem: React.FC<ResultListItemProps> = ({
  result,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-row justify-between items-center w-full p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
    >
      <div className="flex flex-col items-start">
        <span className="text-white font-medium">{result.winner}</span>
        <span className="text-white/70 text-sm">{result.loser}</span>
      </div>
      <div className="flex flex-row gap-2">
        <span className="text-white font-bold">Flight {result.flight}</span>
        <span className="text-white/70">-</span>
        <span className="text-white font-bold">Match {result.match}</span>
      </div>
    </button>
  );
};
