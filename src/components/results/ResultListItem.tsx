import React from "react";

interface ResultListItemProps {
  result: {
    sailor1: string;
    sailor2: string;
  };
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
        <span className="text-white font-medium">{result.sailor1}</span>
        <span className="text-white/70 text-sm">{result.sailor2}</span>
      </div>
      <div className="flex flex-row gap-2">
        <span className="text-white font-bold">{1}</span>
        <span className="text-white/70">-</span>
        <span className="text-white font-bold">{0}</span>
      </div>
    </button>
  );
};
