interface MatchResult {
    sailor1: string;
    sailor2: string;
}

export function extractSailorNames(matchString: string): MatchResult {
    // Remove the match identifier (e.g., "F3M1: ")
    const matchContent = matchString.split(": ")[1];

    // Split by " beat " to get winner and loser
    const [winner, loser] = matchContent.split(" beat ");

    // Extract just the sailor names (remove team/club names in parentheses)
    const sailor1 = winner.split(" (")[0].trim();
    const sailor2 = loser.split(" (")[0].trim();

    return {
        sailor1,
        sailor2
    };
}

export function processMatchResults(matchStrings: string[]): MatchResult[] {
    return matchStrings.map(extractSailorNames);
}
