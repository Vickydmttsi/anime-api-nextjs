import { NextRequest, NextResponse } from 'next/server';
import { search } from '@/lib/api-logic/controllers/search.controller.js';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = Object.fromEntries(searchParams.entries());

        const mockReq = { query, url: req.url };

        const responseData = await search(mockReq);
        return NextResponse.json({ success: true, results: responseData });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
