import { NextRequest, NextResponse } from 'next/server';
import { getAnimeInfo } from '@/lib/api-logic/controllers/animeInfo.controller.js';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = Object.fromEntries(searchParams.entries());

        const mockReq = { query, url: req.url };
        let responseData: any = null;

        const mockRes = {
            status: (s: number) => mockRes,
            json: (data: any) => { responseData = data; return mockRes; },
            setHeader: () => { },
            headersSent: false
        };

        responseData = await getAnimeInfo(mockReq, mockRes);

        // Some controllers use res.json directly, others return data
        if (responseData && responseData.json) return responseData;

        return NextResponse.json({ success: true, results: responseData });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
