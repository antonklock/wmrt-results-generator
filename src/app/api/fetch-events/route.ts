import { NextResponse } from "next/server";
import { Event } from "../../../types/event"; // Adjust path as necessary

export async function GET() {
    try {
        // Fetch HTML from the target site
        const response = await fetch("https://www.matchracingresults.com/", {
            // Add headers to potentially mimic a browser request if needed
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                Accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
            },
            // Consider adding cache control if fetching frequently
            cache: "no-store", // Ensure fresh data on each request for now
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch from matchracingresults.com: ${response.status} ${response.statusText}`,
            );
        }

        const htmlText = await response.text();

        // --- Parsing Logic (using string manipulation for server-side) ---
        // DOMParser is not available directly in Node.js runtime without extra libraries.
        // We'll use regex or string splitting as a simpler alternative here.

        const extractedEvents: Event[] = [];
        const resultsDivMatch = htmlText.match(/<div id="results"[^>]*>([\s\S]*?)<\/div>/);

        if (resultsDivMatch && resultsDivMatch[1]) {
            const resultsContent = resultsDivMatch[1];
            // Find all list items within relevant sections (directly under h2)
            const sectionRegex = /<h2>(?:20\d{2} Events|Coming soon...)<\/h2>[\s\S]*?<ul>([\s\S]*?)<\/ul>/g;
            let sectionMatch;

            while ((sectionMatch = sectionRegex.exec(resultsContent)) !== null) {
                const ulContent = sectionMatch[1];
                const liRegex = /<li>[\s\S]*?<a\s+href="([^\"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/li>/g;
                let liMatch;

                while ((liMatch = liRegex.exec(ulContent)) !== null) {
                    const relativeUrl = liMatch[1];
                    let title = liMatch[2];

                    // Basic cleanup for title (remove potential HTML tags within the anchor)
                    title = title.replace(/<[^>]+>/g, "").trim();

                    // Check if the link is valid and not part of a struck-through element
                    const fullLiHtml = liMatch[0]; // Get the full <li> HTML
                    const isCancelled = /<s[^>]*>[\s\S]*?<a/.test(fullLiHtml) || /<s>[\s\S]*?<a/.test(fullLiHtml);

                    if (relativeUrl && title && relativeUrl.startsWith("/") && !isCancelled) {
                        extractedEvents.push({
                            title,
                            url: "https://www.matchracingresults.com" + relativeUrl,
                        });
                    }
                }
            }
        }

        // --- End Parsing Logic ---

        return NextResponse.json(extractedEvents);
    } catch (error) {
        console.error("[API Fetch Error]:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown server error";
        return NextResponse.json(
            { message: `Error fetching or parsing events: ${errorMessage}` },
            { status: 500 },
        );
    }
} 