interface MatchResult {
    sailor1: string;
    sailor2: string;
    flight: number;
    match: number;
}

export function extractSailorNames(matchString: string): MatchResult {
    // Extract the match identifier (e.g., "F3M1: ")
    const [identifier, matchContent] = matchString.split(": ");

    // Extract flight and match numbers from identifier
    const flightMatch = identifier.match(/F(\d+)/);
    const matchMatch = identifier.match(/M(\d+)/);
    const flight = flightMatch ? parseInt(flightMatch[1], 10) : 0;
    const match = matchMatch ? parseInt(matchMatch[1], 10) : 0;

    // Split by " beat " to get winner and loser
    const [winner, loser] = matchContent.split(" beat ");

    // Extract just the sailor names (remove team/club names in parentheses)
    const sailor1 = winner.split(" (")[0].trim();
    const sailor2 = loser.split(" (")[0].trim();

    return {
        sailor1,
        sailor2,
        flight,
        match
    };
}

export function processMatchResults(matchStrings: string[]): MatchResult[] {
    return matchStrings.map(extractSailorNames);
}
