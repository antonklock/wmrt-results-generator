export function extractSailorNames(matchString: string): MatchResult {
    // Extract the match identifier (e.g., "F3M1: ")
    const [identifier, matchContent] = matchString.split(": ");

    // Extract flight and match numbers from identifier
    const flightMatch = identifier.match(/F(\d+)/);
    const matchMatch = identifier.match(/M(\d+)/);
    const flight = flightMatch ? parseInt(flightMatch[1], 10) : 0;
    const match = matchMatch ? parseInt(matchMatch[1], 10) : 0;

    // Split by " beat " to get winner and loser
    const [winnerName, loserName] = matchContent.split(" beat ");

    // Extract just the sailor names (remove team/club names in parentheses)
    const winner = winnerName.split(" (")[0].trim();
    const loser = loserName.split(" (")[0].trim();

    return {
        winner,
        loser,
        flight,
        match
    };
}

export function processMatchResults(matchStrings: string[]): MatchResult[] {
    return matchStrings.map(extractSailorNames);
}
