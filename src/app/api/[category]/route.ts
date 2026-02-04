import { NextRequest, NextResponse } from 'next/server';
import { getHomeInfo } from '@/lib/api-logic/controllers/homeInfo.controller.js';
import { getCategory } from '@/lib/api-logic/controllers/category.controller.js';

// This is a catch-all route for /api and /api/[category]
export async function GET(req: NextRequest, { params }: { params: Promise<{ category?: string }> }) {
    try {
        const { category } = await params;
        const { searchParams } = new URL(req.url);
        const query = Object.fromEntries(searchParams.entries());

        // Mock Express req/res for existing controllers
        const mockReq = { query, params: { category }, url: req.url };
        let responseData: any = null;

        const mockRes = {
            status: (s: number) => mockRes,
            json: (data: any) => { responseData = data; return mockRes; },
            setHeader: () => { },
            headersSent: false
        };

        if (!category || category === 'home') {
            responseData = await getHomeInfo(mockReq, mockRes);
        } else {
            responseData = await getCategory(mockReq, mockRes, category);
        }

        return NextResponse.json({ success: true, results: responseData });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
