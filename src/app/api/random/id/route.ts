import { NextRequest, NextResponse } from 'next/server';
import { getRandomId } from '@/lib/api-logic/controllers/randomId.controller.js';

export async function GET(req: NextRequest) {
    try {
        // Mock Express req/res
        const mockReq = { query: {}, url: req.url };
        let responseData: any = null;

        const mockRes = {
            status: (s: number) => mockRes,
            json: (data: any) => { responseData = data; return mockRes; },
            setHeader: () => { },
            headersSent: false
        };

        responseData = await getRandomId(mockReq, mockRes);

        return NextResponse.json({ success: true, results: responseData });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
