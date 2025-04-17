import { NextRequest, NextResponse } from 'next/server';
import getNewsFromUrl from '../../../lib/utils/getNewsFromUrl'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const url = body.url;

        if (url) {
            console.log('Fetching news from url:', url)
            const newsItems = await getNewsFromUrl(url);
            return NextResponse.json(newsItems);
        } else {
            console.log('Missing url in request body');
            return NextResponse.json(
                { error: 'Missing url in request body' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error fetching the page:', error);
        return NextResponse.json(
            { error: 'Error fetching the page' },
            { status: 500 }
        );
    }
}