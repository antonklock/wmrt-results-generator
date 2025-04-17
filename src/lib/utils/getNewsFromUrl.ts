export default async function getNewsFromUrl(url: string) {
    try {
        let responseText = "";
        await fetch(url).then(async (res) => responseText = await res.text());

        const newsItems = extractNewsItems(responseText);
        return newsItems;
    } catch (error) {
        console.error('Error fetching the page:', error);
        return [];
    }
}

function extractNewsItems(text: string) {
    const regex = /add_news\('([^']+)'/g;
    const matches = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        matches.push(match[1]);
    }

    return matches;
}