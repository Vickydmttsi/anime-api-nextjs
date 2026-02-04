import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'edge';
import { getHomeInfo } from '@/lib/api-logic/controllers/homeInfo.controller.js';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = Object.fromEntries(searchParams.entries());

        // Mock Express req/res
        const mockReq = { query, url: req.url };
        let responseData: any = null;

        const mockRes = {
            status: (s: number) => mockRes,
            json: (data: any) => { responseData = data; return mockRes; },
            setHeader: () => { },
            headersSent: false
        };

        responseData = await getHomeInfo(mockReq, mockRes);
        return NextResponse.json({ success: true, results: responseData });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
